import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private baseUrl = 'https://employeedb-zj5g.onrender.com/employee'; // Express server URL
  // private baseUrl =  'http://localhost:5000/employee'; // Express server URL

  constructor(private http: HttpClient) { }

  createEmployee(employeeData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, employeeData, this.getHeaders());
  }

  getAllEmployees(currentPage: number, itemsPerPage: number): Observable<any> {
    // ?page=${this.currentPage}&pageSize=${this.itemsPerPage}
    // console.log(this.http.get('https://employeedb-zj5g.onrender.com/employee/getall', this.getHeaders()), "callin online bacend")
    return this.http.get(`${this.baseUrl}/getall?page=${currentPage}&pageSize=${itemsPerPage}`, this.getHeaders());
  }
  getAllWithoutPaginationEmployees(): Observable<any> {
    // ?page=${this.currentPage}&pageSize=${this.itemsPerPage}
    return this.http.get(`${this.baseUrl}/getallWithoutpPAgination`, this.getHeaders());
  }

  getEmployeeByEmail(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/getone/${email}`, this.getHeaders());
  }

  updateEmployeeByEmail(email: string, updatedData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${email}`, updatedData, this.getHeaders());
  }

  deleteEmployeeByEmail(email: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${email}`, this.getHeaders());
  }

  private getHeaders() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    console.log(headers)
    return { headers };
  }
}
