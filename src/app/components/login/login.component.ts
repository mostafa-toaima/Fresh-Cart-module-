import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Core/Services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errMsg: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _Router: Router,
    private _AuthService: AuthService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.pattern(/^[A-Z][a-z0-9]{5,8}$/)],
      ],
    });
  }

  loginHandel(loginForm: FormGroup) {
    this.isLoading = true;
    if (loginForm.valid) {
      this._AuthService.Login(loginForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this._Router.navigate(['/home']);
          localStorage.setItem('token', res.token);
          this._AuthService.decodedToken();
          this.isLoading = false;
        },
        error: (error) => {
          console.log(error);
          this.errMsg = error.error.message;
          this.isLoading = false;
        },
      });
    }
  }
}
