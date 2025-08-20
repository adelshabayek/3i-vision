import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Country, State, City } from 'country-state-city';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddDialogComponent } from '../add-dialog/add-dialog.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-table-add',
  templateUrl: './table-add.component.html',
  styleUrl: './table-add.component.scss',
})
export class TableAddComponent implements OnInit {
  form: FormGroup;
  dataSource: any[] = [];
  userTags: string[] = [];
  existingCodes = [''];
  countries: any[] = [];
  cities: string[] = [];
  showNewTagInput = false;
  newTagName: string = '';
  // Edit mood
  idParam: string | null = null;
  isEditMode = false;
  ////////
  separator?: string | RegExp;
  displayedColumns: string[] = [
    'no',
    'id',
    'code',
    'nameFl',
    'nameSl',
    'tags',
    'country',
    'city',
    'description',
    'actions',
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.form = this.fb.group({
      id: [{ value: null, disabled: true }], //  id
      code: [
        {
          value: 'USR-' + Math.floor(1000 + Math.random() * 9000),
          disabled: true,
        },
      ],
      nameFl: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[A-Za-z\s]+$/), // En and space
        ],
      ],
      nameSl: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[\u0621-\u064A\s]+$/), // Ar and space
        ],
      ],
      country: [''],
      city: [''],
      description: [''],
      ip: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)$/
          ),
        ],
      ],
      tags: [[], [Validators.required, this.mustStartWithDriveLetter]],
    });

    this.form.get('country')?.valueChanges.subscribe((country) => {
      const cityControl = this.form.get('city');
      if (country) {
        cityControl?.setValidators([Validators.required]);
      } else {
        cityControl?.clearValidators();
      }
      cityControl?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.loadCountries();
    //  validators  country
    this.form.get('country')?.valueChanges.subscribe((countryName) => {
      const cityControl = this.form.get('city');
      if (countryName) {
        cityControl?.setValidators([Validators.required]);
        this.loadCities(countryName); // load city when select country
      } else {
        cityControl?.clearValidators();
        this.cities = [];
      }
      cityControl?.updateValueAndValidity();
    });

    // load data
    this.dataSource = JSON.parse(localStorage.getItem('dataSource') || '[]');
    //  grap id in paramiter
    this.idParam = this.route.snapshot.paramMap.get('id');
    if (this.idParam) {
      this.isEditMode = true;
      this.loadDataForEdit(this.idParam);
    }
  }

  // must value be [A-Z]:\ tags
mustStartWithDriveLetter(control: AbstractControl): ValidationErrors | null {
  const tags: string[] = control.value || [];
  if (!tags.length) return null;

  const invalid = tags.some((tag) => !/^[A-Z]:\\/.test(tag));
  return invalid ? { mustStartWithDriveLetter: true } : null;
}

onTagAdd(event: any): void {
  const value = event.value;

  // if user not write [A-Z]:\ => remove value he writes
  if (!/^[A-Z]:\\/.test(value)) {
    const tags = this.form.get('tags')?.value || [];
    tags.pop();
    this.form.get('tags')?.setValue(tags);
  }
}

  loadCountries() {
    this.countries = Country.getAllCountries();
  }

  loadCities(countryCode: string) {
    this.cities = [];
    const states = State.getStatesOfCountry(countryCode);
    states.forEach((state) => {
      const stateCities = City.getCitiesOfState(countryCode, state.isoCode);
      this.cities.push(...stateCities.map((c) => c.name));
    });
  }

  // function to generate unique ID
  private generateId(): number {
    let lastId = Number(localStorage.getItem('lastId') || '0');
    lastId++;
    localStorage.setItem('lastId', lastId.toString());
    return lastId;
  }

  uniqueCodeValidator(control: AbstractControl) {
    if (this.existingCodes.includes(control.value)) {
      return { Unique: false };
    }
    return null;
  }

  private loadDataForEdit(idParam: string) {
    const item = this.dataSource.find(
      (x: any) => String(x.id) === String(idParam)
    );
    if (!item) return;

    // select city if country selected
    if (item.country) {
      this.loadCities(item.country);
    }

    this.form.patchValue(item);
  }

  // ————— Actions —————
  submitForm() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();

    // change code to name
    if (formValue.country) {
      const countryObj = this.countries.find(
        (c) => c.isoCode === formValue.country
      );
      if (countryObj) {
        formValue.country = countryObj.name; // name only
      }
    }

    // complete inputs
    if (!formValue.country) formValue.country = '- - - -';
    if (!formValue.city) formValue.city = '- - - -';
    if (!formValue.description) formValue.description = '- - - -';

    let data = JSON.parse(localStorage.getItem('dataSource') || '[]');

    if (this.isEditMode && this.idParam) {
      // update
      const index = data.findIndex(
        (x: any) => String(x.id) === String(this.idParam)
      );
      if (index > -1) {
        data[index] = { ...data[index], ...formValue }; // save inputs
      }
    } else {
      // add
      if (!formValue.id) {
        formValue.id = this.generateId();
      }
      data.unshift(formValue);
    }

    localStorage.setItem('dataSource', JSON.stringify(data));
    this.dataSource = [...data];

    // if success
    this.dialog.open(AddDialogComponent, { width: '350px' });

    // when add make Reset
    if (!this.isEditMode) {
      this.form.reset({
        code: 'USR-' + Math.floor(1000 + Math.random() * 9000),
      });
    }

    this.router.navigate(['/']); // back table
  }

  closeForm() {
    this.router.navigate(['/']); // back to table
  }
}
