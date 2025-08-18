import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Country, State, City } from 'country-state-city';

import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddDialogComponent } from '../add-dialog/add-dialog.component';
import { HttpClient } from '@angular/common/http';
import { Media } from '../../../modules/media';
@Component({
  selector: 'app-table-add',
  templateUrl: './table-add.component.html',
  styleUrl: './table-add.component.scss',
})
export class TableAddComponent implements OnInit {
  form: FormGroup;
  media!: Media[];
  selectedMedia!: Media[];
  dataSource: any[] = [];
  userTags: string[] = [];
  existingCodes = [''];
  countries: any[] = [];
  cities: string[] = [];
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
    'actions'
  ];
showNewTagInput = false;
newTagName: string = '';

  constructor(
    private router: Router,
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
      tags: [[], Validators.required],  //  tags required
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
    this.form.get('country')?.valueChanges.subscribe((countryCode) => {
      const cityControl = this.form.get('city');
      if (countryCode) {
        cityControl?.setValidators([Validators.required]);
        this.loadCities(countryCode); // load city when select country
      } else {
        cityControl?.clearValidators();
        this.cities = [];
      }
      cityControl?.updateValueAndValidity();
    });

    this.media = [
      { name: 'Facebook', code: 'Facebook' },
      { name: 'Youtube', code: 'Youtube' },
      { name: 'Instagram', code: 'Instagram' },
      { name: 'Twitter', code: 'Twitter' },
      { name: 'Linkedin', code: 'Linkedin' },
    ];

        this.dataSource = JSON.parse(localStorage.getItem('dataSource') || '[]');

  }

  checkNewTag(event: any) {
  if (event.value.includes('new')) {
    this.showNewTagInput = true;
  } else {
    this.showNewTagInput = false;
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

  submitForm() {
    if (this.form.valid) {
      const newUser = this.form.getRawValue();

      // ###
      if (!newUser.id) {
        newUser.id = this.generateId();
      }

      // Country
      if (!newUser.country) {
        newUser.country = '###';
      }

      // City
      if (!newUser.city) {
        newUser.city = '###';
      }

      // Description
      if (!newUser.description) {
        newUser.description = '###';
      }

      let dataSource = JSON.parse(localStorage.getItem('dataSource') || '[]');

      // add element in top
      dataSource.unshift(newUser); //  dataSource.push(newUser)

      localStorage.setItem('dataSource', JSON.stringify(dataSource));

      // rafresh table
      this.dataSource = [...dataSource];

      // open dailog
      this.dialog.open(AddDialogComponent, { width: '350px' });

      // reset form
      this.form.reset({
        code: 'USR-' + Math.floor(1000 + Math.random() * 9000),
      });
    } else {
      this.form.markAllAsTouched();
    }

    this.router.navigate(['/']); // back table
  }

  closeForm() {
    this.router.navigate(['/']); // back to table
  }
}
