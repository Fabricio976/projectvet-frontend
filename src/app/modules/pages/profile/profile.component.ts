import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-animal-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  animal: any = null;
  private apiUrl = 'http://localhost:8080/projectvet';
  isEditing: boolean = false;
  animalForm!: FormGroup;
  originalAnimal: any = null;
  selectedFile: File | null = null;
  showImageOptions: boolean = false;
  previewUrl: string | null = null;
  showResponsibleCard = false;

  servicePetOptions = [
    { value: 'Pet Shop', label: 'Pet Shop' },
    { value: 'Clínica Veterinária', label: 'Clínica Veterinária' },
    { value: 'Clínica e PetShop', label: 'Clínica e PetShop' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!this.authService.isLoggedIn()) {
      console.log('Usuário não logado, redirecionando para /login');
      this.router.navigate(['/login']);
      return;
    }

    const animalId = this.route.snapshot.paramMap.get('id');
    if (animalId) {
      this.loadAnimal(animalId, token);
    }
  }

  createForm(): void {
    this.animalForm = this.fb.group({
      rg: [''],
      name: [''],
      responsibleNome: [''],
      specie: [''],
      race: [''],
      age: [''],
      servicePet: [''],
    });
  }

  loadAnimal(animalId: string, token: string | null): void {
    if (!token) return;
    this.http
      .get(`${this.apiUrl}/animal/search/${animalId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .subscribe({
        next: (response: any) => {
          this.animal = response;
          this.animal.photoUrl = response.photoUrl && response.photoUrl.startsWith('/images')
            ? `http://localhost:8080${response.photoUrl}`
            : response.photoUrl || null;
          this.originalAnimal = { ...response };
          this.animalForm.patchValue({
            rg: response.rg,
            name: response.name,
            responsibleNome: response.responsible?.nome || '',
            specie: response.specie,
            race: response.race || '',
            age: response.age || '',
            servicePet: response.servicePet || ''
          });
          this.previewUrl = this.animal.photoUrl;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erro ao carregar animal:', error);
          alert('Erro ao carregar o perfil do animal.');
        }
      });
  }

  startEditing(): void {
    this.isEditing = true;
    this.showResponsibleCard = false;
  }

  toggleImageOptions(): void {
    this.showImageOptions = !this.showImageOptions;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result as string;
      reader.readAsDataURL(this.selectedFile);
      this.uploadImage();
    }
  }

  uploadImage(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    const token = localStorage.getItem('token');
    const animalId = this.route.snapshot.paramMap.get('id');

    firstValueFrom(
      this.http.post(`http://localhost:8080/images/upload/${animalId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ).then((response: any) => {
      const imageUrl = `http://localhost:8080${response.url}`;
      this.animal.photoUrl = imageUrl;
      this.showImageOptions = false;
      this.cdr.detectChanges();
      this.loadAnimal(animalId!, token);
    }).catch((error) => {
      console.error('Status do erro:', error.status);
      alert('Erro ao fazer upload da imagem.');
    });
  }

  removeImage(): void {
    this.animal.photoUrl = null;
    this.previewUrl = null;
    this.showImageOptions = false;
  }

  updateAnimal(updatedAnimal: any): void {
    const token = localStorage.getItem('token');
    const animalId = this.route.snapshot.paramMap.get('id');

    firstValueFrom(
      this.http.put(`${this.apiUrl}/animal/editAnimal/${animalId}`, updatedAnimal, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ).then(() => {
      this.animal = updatedAnimal;
      this.showImageOptions = false;
      alert('Imagem atualizada com sucesso!');
    }).catch((error) => {
      console.error('Erro ao atualizar animal:', error);
      alert('Erro ao atualizar o animal.');
    });
  }
  saveChanges(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const animalId = this.route.snapshot.paramMap.get('id');
    const updatedAnimal = {
      ...this.animal,
      ...this.animalForm.value,
      responsible: { nome: this.animalForm.value.responsibleNome },
    }
    this.http
      .put(`${this.apiUrl}/animal/editAnimal/${animalId}`, updatedAnimal, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (response: any) => {
          this.animal = updatedAnimal;
          this.isEditing = false;
          alert(response.message);
        },
        error: (error) => {
          console.error('Erro ao atualizar animal:', error);
          alert('Erro ao atualizar o animal.');
        },
      });
  }

  cancelEditing(): void {
    this.animalForm.patchValue(this.originalAnimal);
    this.isEditing = false;
    this.showResponsibleCard = false;
  }

  deleteAnimal(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const animalId = this.route.snapshot.paramMap.get('id');
    if (confirm('Tem certeza que deseja excluir este animal?')) {
      this.http
        .delete(`${this.apiUrl}/animal/delete/${animalId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .subscribe({
          next: (response: any) => {
            alert(response.message);
            this.router.navigate(['/home']);
          },
          error: (error) => {
            console.error('Erro ao excluir animal:', error);
          },
        });
    }
  }
  toggleResponsibleCard(event: Event): void {
    event.preventDefault();
    this.showResponsibleCard = !this.showResponsibleCard;
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.showResponsibleCard) {
      const card = document.getElementById('responsibleCard');
      const target = event.target as HTMLElement;
      if (card && !card.contains(target) && target.tagName !== 'A') { // Exclui o link do dono
        this.showResponsibleCard = false;
      }
    }
  }
}
