const inquirer = require('inquirer')

// Prompt for choices
inquirer.prompt([
  {
    type: 'list',
    message: 'What would you like to do?',
    name: 'choice',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      'Exit',
    ],
  },
])
.then((data) => {
  switch (data.choice) {
    case 'View all departments':
        viewAllDepartments()
        break

    case 'View all roles':
        viewAllRoles()
        break

    case 'View all employees':
        viewAllEmployees()
        break

    case 'Add a department':
        addDepartment()
        break

    case 'Add a role':
        addRole()
        break

    case 'Add an employee':
        addEmployee()
        break

    case 'Update an employee role':
        updateEmployee()
        break

    case 'Exit':
        process.exit()

  }
})

