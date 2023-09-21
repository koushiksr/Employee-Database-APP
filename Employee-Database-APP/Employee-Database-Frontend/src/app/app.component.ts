import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from './employee.service';
import { NgForm } from '@angular/forms';
import { style } from '@angular/animations';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  template: `<input type="text" [placeholder]="selectedSearchCriteria">`
})
export class EmployeeComponent implements OnInit {
  selectedEmployee: any = {};
  employees: any[] = [];
  newEmployee: any = {};
  editMood: boolean = false;
  email: string = "";
  searchResults: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  allEmployeesWithoutPagination: any[] = [];


  @ViewChild('employeeForm') form!: NgForm;
  cdr: any;

  constructor(private employeeService: EmployeeService) { }

  ngOnInit() {
    this.loadEmployees();
    this.clearForm();
    this.validationEmail(false);
    this.midPageValUpdate();
  }



  isPopUpOfAddEmployee: boolean = false
  PopUpOfAddEmployee() {
    this.isPopUpOfAddEmployee = true;
  }
  closePopUpOfAddEmployee() {
    this.isPopUpOfAddEmployee = false;
  }
  PopUpOfEditEmployee(email: string) {
    this.editEmployee(email)
    this.isPopUpOfAddEmployee = true;
  }
  closePopUpOfEditEmployee(email: string) {
    this.clearForm();
    this.editEmployee(email)
    this.isPopUpOfAddEmployee = false;
  }


  isPopupOpen: boolean = false;
  maxHeight: number = 200;

  openPopup() {
    this.isPopupOpen = true;
    //string all employeed without pagination for seach apearence
    this.loadAllEmployees()
  }

  closePopup() {
    this.isPopupOpen = false;
  }

  //==========================================================================

  selectedSearchCriteria: string = 'email'; // Default search criteria
  searchText: string = ''; // Text to search for
  searchSubject = new Subject<string>();
  searchSubscription: Subscription | null = null;

  nextPage(): void {
    this.currentPage++;
    this.midPageValUpdate()
    this.loadEmployees();
  }
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.midPageValUpdate()
      this.loadEmployees();
      if (this.currentPage <= 1) {

      }
    }
  }
  midPageValUpdate(): void {
    // Get a reference to the anchor element by its ID
    const pageNumberLink1 = document.getElementById('page-link1') || "";
    const pageNumberLink2 = document.getElementById('page-link2') || "";
    const pageNumberLink3 = document.getElementById('page-link3') || "";

    // Define the variable value you want to display
    const variableValue1 = this.currentPage + 1;
    const variableValue2 = this.currentPage + 2;
    const variableValue3 = this.currentPage + 3;

    // Set the text content of the anchor tag
    if (pageNumberLink1 instanceof HTMLElement) {
      pageNumberLink1.textContent = variableValue1.toString();
    }
    if (pageNumberLink2 instanceof HTMLElement) {
      pageNumberLink2.textContent = variableValue2.toString();
    }
    if (pageNumberLink3 instanceof HTMLElement) {
      pageNumberLink3.textContent = variableValue3.toString();
    }


  }

  midPage1(): void {
    this.currentPage = this.currentPage + 1;
    this.loadEmployees();
    this.midPageValUpdate();
  }
  midPage2(): void {
    this.currentPage = this.currentPage + 2;
    this.loadEmployees();
    this.midPageValUpdate();
  }
  midPage3(): void {
    this.currentPage = this.currentPage + 3;
    this.loadEmployees();
    this.midPageValUpdate();
  }


  searchAndUpdate() {
    this.searchResults = [];
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    if (!this.searchText.trim()) {
      return;
    }

    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((text) => this.performSearch(text))
      )
      .subscribe((results) => {
        this.searchResults.push(results);
      });
    this.searchSubject.next(this.searchText);
  }

  performSearch(text: string) {
    if (text) {
      return this.allEmployeesWithoutPagination.filter((employee) =>
        this.filterByCriteria(employee, this.selectedSearchCriteria)
      );
    } else {
      return [];
    }
  }

  // Function to select a search result from the auto-suggest dropdown
  selectResult(result: any) {
    // You can perform actions when a result is selected, such as filling the input field
    this.searchText = result.email;
    // Clear the auto-suggest dropdown
    this.searchResults = [];
  }

  // Function to filter employees based on selected criteria
  filterByCriteria(employee: any, criteria: string): boolean {
    switch (criteria) {
      case 'email':
        return employee.email.toLowerCase().includes(this.searchText.toLowerCase());
      case 'joiningDate':
        return employee.joiningDate.includes(this.searchText);
      case 'employeeId':
        return employee.employeeId.toLowerCase().includes(this.searchText.toLowerCase());
      // case 'joiningDate':
      //   return employee.joiningDate.includes(this.searchText);
      case 'firstName':
        return employee.firstName.toLowerCase().includes(this.searchText.toLowerCase());
      case 'lastName':
        return employee.lastName.toLowerCase().includes(this.searchText.toLowerCase());
      case 'position':
        return employee.position.includes(this.searchText);
      case 'department':
        return employee.department.includes(this.searchText);
      // case 'salary':
      //   return employee.salary.includes(this.searchText);
      // case 'experience':
      //   return employee.experience.includes(this.searchText);
      case 'createdDate':
        return employee.createdDate.includes(this.searchText);
      // Add more cases for other criteria
      default:
        return false;
    }
  }

  sortDirection: 'asc' | 'desc' = 'asc';
  sortBy: string = 'firstName';

  sortByColumn(column: string) {
    if (column === this.sortBy) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDirection = 'asc';
    }

    this.employees.sort((a, b) => {
      const valueA = this.getValueForSorting(a, column);
      const valueB = this.getValueForSorting(b, column);

      // Check if the column is 'employeeId' and use custom sorting logic
      if (column === 'employeeId') {
        return this.compareAlphanumeric(valueA, valueB);
      }

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  compareAlphanumeric(valueA: any, valueB: any): number {
    const numericA = parseInt(valueA.match(/\d+/)[0]);
    const numericB = parseInt(valueB.match(/\d+/)[0]);
    const restA = valueA.replace(/\d+/g, '');
    const restB = valueB.replace(/\d+/g, '');

    if (numericA < numericB) return this.sortDirection === 'asc' ? -1 : 1;
    if (numericA > numericB) return this.sortDirection === 'asc' ? 1 : -1;

    // If numeric parts are the same, compare the rest of the string
    if (restA < restB) return this.sortDirection === 'asc' ? -1 : 1;
    if (restA > restB) return this.sortDirection === 'asc' ? 1 : -1;

    return 0;
  }

  getValueForSorting(employee: any, column: string): any {
    if (column === 'salary' || column === 'joiningDate' || column === 'experience' || column === 'createdDate') {
      return parseFloat(employee[column]);
    }
    return employee[column].toLowerCase();
  }


  validationEmail(value: boolean) {
    const input = document.querySelector('.gmail input') as HTMLInputElement;
    const emailIcon = document.querySelector('.email-icon') as HTMLElement;
    if (value == true) {
      emailIcon.style.color = "#00ff00";
    } else {
      emailIcon.style.color = "#b4b4b4";
    }
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!input) {
      console.error("Input element not found.");
      return;
    }
    if (!emailIcon) {
      console.error("Email icon element not found.");
      return;
    }
    input.addEventListener("keyup", () => {
      if (input.value === "") {
        emailIcon.classList.remove("ui-check-circle");
        emailIcon.classList.add("uil-envelope");
        emailIcon.style.color = "#b4b4b4";
      } else if (input.value.match(pattern)) {
        emailIcon.classList.remove("uil-envelope");
        emailIcon.classList.add("ui-check-circle");
        emailIcon.style.color = "#00ff00";
      } else {
        emailIcon.classList.remove("ui-check-circle");
        emailIcon.classList.add("uil-envelope");
        emailIcon.style.color = "#ff0000";
      }
    });
  }

  clearForm() {
    this.editMood = false
    this.newEmployee = {};
    this.validationEmail(false)
    const edit = document.getElementById('edit');
    if (edit instanceof HTMLElement) {
      if (this.editMood) {
        edit.classList.add('editgreen');
        edit.classList.remove('editblue');
      } else {
        edit.classList.remove('editgreen');
        edit.classList.add('editblue');
      }
    }
  }
  decisionForCreateAndUpdate(employeeForm: any) {
    if (this.editMood) {
      this.updateEmployee(this.email, employeeForm);
    } else {
      this.createEmployee();
    }
  }

  loadEmployees() {
    this.employeeService.getAllEmployees(this.currentPage, this.itemsPerPage).subscribe((data: any) => {
      this.employees = data;
      console.log(data)
    });
  }
  loadAllEmployees() {
    this.employeeService.getAllWithoutPaginationEmployees().subscribe((data: any) => {
      this.allEmployeesWithoutPagination = data;
      console.log(data)

    });
    console.log(this.allEmployeesWithoutPagination)
  }
  createEmployee() {
    console.log(this.employees)
    this.employeeService.createEmployee(this.newEmployee).subscribe((response: any) => {
      if (response.firstName == undefined) {
        console.log("email already exist")
        alert("email is already exist ")
        this.validationEmail(false)
      } else {
        this.validationEmail(false)
        alert(`Employee "${response.firstName} ${response.lastName}" is Added to Database`)
        console.log(`Employee "${response.firstName} ${response.lastName}" is Added to Database`)
      }
      this.loadEmployees();
      this.newEmployee = {};
    }, (error: any) => {

      const inputString = error.error.errors
      const regex = /`([^`]+)`/g;
      const extractedWords = [];
      let match;
      while ((match = regex.exec(inputString)) !== null) {
        extractedWords.push(match[1]);
      }
      const resultString = extractedWords.join(", ");
      if (resultString == "") { console.log("email is invalid"); alert("email is invalid") }
      else {
        console.log(resultString);
        alert("Employee " + resultString + "  is required")
      }
      this.validationEmail(false)
    });
  }

  editEmployee(email: string) {
    this.validationEmail(true)
    this.email = email;
    const objectsWithEmail = this.employees.find(obj => obj.email == email);
    console.log("object update email")
    console.log(objectsWithEmail)

    this.form.setValue({
      firstName: objectsWithEmail.firstName || '',
      lastName: objectsWithEmail.lastName || '',
      email: objectsWithEmail.email || '',
      position: objectsWithEmail.position || '',
      department: objectsWithEmail.department || '',
      experience: objectsWithEmail.experience || "",
      joiningDate: objectsWithEmail.joiningDate || '',
      salary: objectsWithEmail.salary || "",
      // createdDate: objectsWithEmail.createdDate || '',
      // employeeId: objectsWithEmail.employeeId || '',
    })

    this.editMood = true
    this.loadEmployees();
    // this.clearForm()
    const edit = document.getElementById('edit');
    if (edit instanceof HTMLElement) {
      if (this.editMood) {
        edit.classList.add('editgreen');
        edit.classList.remove('editblue');
      } else {
        edit.classList.remove('editgreen');
        edit.classList.add('editblue');
      }
    }
  }


  updateEmployee(email: string, employeeForm: any) {
    this.validationEmail(true)
    console.log(this.employees)
    this.employeeService.updateEmployeeByEmail(email, employeeForm)
      .subscribe((response: any) => {
        this.loadEmployees();
        this.selectedEmployee = {}
      }, (error: any) => {
        console.log(error);
      });
  }

  deleteEmployee(email: string) {
    this.validationEmail(false)
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployeeByEmail(email).subscribe(() => {
        this.loadEmployees();
      });
    }
  }
}
