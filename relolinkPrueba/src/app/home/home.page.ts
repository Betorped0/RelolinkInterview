import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage {
  currentStep = 1;
  totalSteps = 5;
  totalStepsArray = Array(this.totalSteps).fill(0);

  countries = ['Argentina', 'Mexico'];
  cityOptions: string[] = [];

  formValues: any = {
    name: '',
    lastName: '',
    country: '',
    city: '',
    phoneNumber: '',
    email: ''
  };

  countryCities: any = {
    Argentina: ['Buenos Aires', 'Rosario'],
    Mexico: ['Ciudad de México', 'Juárez']
  };

  constructor(
    private http: HttpClient,
    private toastController: ToastController
  ) {}

goToStep(step: number) {
  if (step >= 1 && step <= this.totalSteps) {
    this.currentStep = step;
  }
}

  nextStep() {
    if (this.isCurrentStepValid()) {
      this.currentStep++;
      this.showToast('Step completed!', 'success');
    } else {
      this.showToast('Please complete the current step correctly.', 'warning');
    }
  }
  
  isCurrentStepValid(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.formValues.name.length > 1 && this.formValues.lastName.length > 1;
      case 2:
        return !!this.formValues.country && !!this.formValues.city;
      case 3:
        return this.formValues.phoneNumber.length > 7; // validating at least 8 digits
      case 4:
        const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
        return emailRegex.test(this.formValues.email);
      default:
        return false;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  checkStepValidity() {
    if (this.isCurrentStepValid()) {
      if (this.currentStep < this.totalSteps) {
        this.showToast(`Step ${this.currentStep} completed!`, 'success');
        this.currentStep++;
      }
    } else {
      this.showToast('Please complete this step correctly.', 'warning'); 
    }
  }

  onPhoneInput(event: any) {
    const input = event.target.value;
    // Remove any non-digit character
    event.target.value = input.replace(/\D/g, '');
    this.formValues.phoneNumber = event.target.value;
  }

  onCountryChange(country: string) {
    this.cityOptions = this.countryCities[country] || [];
    this.formValues.city = '';
    this.formValues.phoneNumber = country === 'Argentina' ? '+54 ' : '+52 ';
  }

  onSubmit() {
    if (!this.validateForm()) {
      this.showToast('Please complete all fields with valid values.', 'danger');
      return;
    }
  
    const payload = { userInfo: { ...this.formValues } };
  
    this.http.post('http://localhost:3000/SaveUser', payload).subscribe({
      next: () => this.showToast('Form submitted successfully! 🎉', 'success'),
      error: () => this.showToast('Failed to submit. Check your API.', 'danger')
    });
  }

  validateForm(): boolean {
    const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
    return (
      this.formValues.name &&
      this.formValues.lastName &&
      this.formValues.country &&
      this.formValues.city &&
      this.formValues.phoneNumber &&
      emailRegex.test(this.formValues.email)
    );
  }
  async showToast(message: string, color: 'success' | 'warning' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present(); 
  }
}