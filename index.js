const inquirer = require(`inquirer`)
const mysql = require(`mysql2`)
require(`dotenv`).config()
const { uuid } = require(`uuidv4`)

const connection = mysql.createConnection({
    host: `localhost`,
    user: `root`,
    password: process.env.PASSWORD

  })

connection.connect((err) => {
    if (err) throw err
    console.log(`Connected!`)
    menu()
})

function menu() {
    inquirer.prompt([
        {
          type: `list`,
          message: `What would you like to do?`,
          name: `choice`,
          choices: [
            `View all departments`,
            `View all roles`,
            `View all employees`,
            `Add a department`,
            `Add a role`,
            `Add an employee`,
            `Update an employee role`,
            `Exit`,
          ],
        },
      ])
      .then((data) => {
        switch (data.choice) {
          case `View all departments`:
              viewAllDepartments()
              break
      
          case `View all roles`:
              viewAllRoles()
              break
      
          case `View all employees`:
              viewAllEmployees()
              break
      
          case `Add a department`:
              addDepartment()
              break
      
          case `Add a role`:
              addRole()
              break
      
          case `Add an employee`:
              addEmployee()
              break
      
          case `Update an employee role`:
              updateEmployee()
              break
      
          case `Exit`:
              process.exit()
      
        }
      })      
}

function viewAllDepartments() {
    connection.query('SELECT * FROM db.department', (err, res) => {
      if (err) throw err
      console.table(res)
      menu()
    })
}

function viewAllRoles() {
    connection.query('SELECT * FROM db.role', (err, res) => {
      if (err) throw err
      console.table(res)
      menu()
    })
}

function viewAllEmployees() {
    connection.query('SELECT * FROM db.employee', (err, res) => {
      if (err) throw err
      console.table(res)
      menu()
    })
}

function addDepartment() {
    connection.query(`SELECT * FROM db.department`, (err, res)=> {
        if (err) throw err
        inquirer.prompt([
            {
                type: `input`,
                name: `name`,
                message: `What is the new department name?`
            }
        ])
        .then((data) => {
            connection.query(`INSERT INTO db.department (department_id , department_name) VALUES ('${uuidv4()}' , '${data.name}')`, (err, res) => {
                if (err) throw err
                menu()
            })
        })
    })
}

function addRole() {
    connection.query(`SELECT * FROM db.role`, (err, res)=> {
        if (err) throw err
        departmentNameArray= []
        connection.query(`SELECT department_name FROM db.department`, (err, res)=>{
            if (err) throw err
            res.forEach(department => {
                departmentNameArray.push(department.department_name)
            })
        })
        inquirer.prompt([
            {
                type: `input`,
                name: `title`,
                message: `What is the title of the new role?`
            },
            {
                type: `number`,
                name: `salary`,
                message: `What is the salary of the new role?`
            },
            {
                type: `list`,
                name: `department`,
                message: `What is the role's department?`,
                choices: departmentNameArray
            }
        ])
        .then((data) => {
            connection.query(`INSERT INTO db.role (role_id , role_title, role_department, role_salary) VALUES ('${uuid()}' , '${data.title}', '${data.department}', '${data.salary}')`, (err, res) => {
                if (err) throw err
                menu()
            })
        })
    })
}

function addEmployee() {
    connection.query(`SELECT * FROM db.employee`, (err, res)=> {
        if (err) throw err
        roleNameArray= []
        managerArray = [`No one`]

        connection.query(`SELECT * FROM db.role`, (err, res)=>{
            if (err) throw err
            res.forEach(role => {
                roleNameArray.push(role.role_title)
            })
        })

        connection.query(`SELECT * FROM db.employee`, (err, res)=>{
            if (err) throw err
            res.forEach(employee => {
                if(employee.employee_title === `Manager`){
                    managerArray.push(`${employee.employee_firstName}  ${employee.employee_lastName}`)
                }
            })
        })

        inquirer.prompt([
            {
                type: `input`,
                name: `firstName`,
                message: `What is the new employee's first name?`
            },
            {
                type: `input`,
                name: `lastName`,
                message: `What is the new employee's last name?`
            },
            {
                type: `list`,
                name: `role`,
                message: `What is the new employee's role?`,
                choices: roleNameArray
            },
            {
                type: `list`,
                name: `manager`,
                message: `What is the new employee's manager?`,
                choices: managerArray
            },
        ])
        .then((data)=> {
            salary = 0
            department = undefined
            connection.query(`SELECT * FROM db.role`, (err, res)=>{
                if (err) throw err
                res.forEach(role => {
                    if(data.role === role.role_title){
                        salary = role.role_salary
                        department = role.role_department
                    } 
                })
                connection.query(`INSERT INTO db.employee (employee_id, employee_firstName, employee_lastName, employee_title, employee_department, employee_salary, employee_manager) VALUES ('${uuid()}' , '${data.firstName}', '${data.lastName}', '${data.role}', '${department}', '${salary}', '${data.manager}')`, (err, res) => {
                    if (err) throw err
                    menu()
                })
            })
        })
    })
}

function updateEmployee() {
    connection.query(`SELECT * FROM db.employee` , (err, res)=>{
        if (err) throw err
        employeeArray = []

        res.forEach((employee)=>{
            employeeArray.push(`${employee.employee_firstName} ${employee.employee_lastName}`)
        })
        inquirer.prompt([
            {
                type: `list`,
                name: `name`,
                message: `Which team member are we updating?`,
                choices: employeeArray
            }
        ]).then((data)=> {
            connection.query(`SELECT * FROM db.role` , (err, res)=>{
                if (err) throw err
                roleNameArray = []
                res.forEach((role) =>{
                    roleNameArray.push(role.role_title)
                })
                inquirer.prompt([
                    {
                        type: `list`,
                        name: `role`,
                        message: `What is the updated role?`,
                        choices: roleNameArray
                    }
                ]).then((data) =>{
                    menu()
                })
            })
        })
    })
}
