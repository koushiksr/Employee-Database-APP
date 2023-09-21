export class Employee {
     constructor(firstName = '', lastName = '', position = '', department = '', salary = 0, joiningDate: '', experience: 0) {//employeeId: 0,
          // this.employeeId = employeeId;
          this.firstName = firstName;
          this.lastName = lastName;
          this.position = position;
          this.department = department;
          this.salary = salary;
          this.joiningDate = joiningDate;
          this.experience = experience;
     }
     // employeeId: number;
     firstName: string;
     lastName: string;
     position: string;
     department: string;
     salary: number;
     joiningDate: string;
     experience: number;
}

