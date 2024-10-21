export const INPUT_FIELDS = [
  {
    id: 0,
    label: 'Prénom',
    name: 'firstName',
    customValidation: { required: true, minlength: 4 },
  },
  {
    id: 1,
    label: 'Nom',
    name: 'lastName',
    customValidation: { required: true, minlength: 4 },
  },
  {
    id: 2,
    label: 'Adresse',
    name: 'address1',
    customValidation: { required: true, minlength: 4 },
  },
  {
    id: 3,
    label: 'Code postal',
    name: 'postcode',
    customValidation: { required: true, minlength: 4, pattern: '[+0-9]{4,6}' },
  },
  {
    id: 4,
    label: 'Ville',
    name: 'city',
    customValidation: { required: true, minlength: 2 },
  },
  {
    id: 5,
    label: 'Email',
    name: 'email',
    customValidation: { required: true, type: 'email' },
  },
  {
    id: 6,
    label: 'Téléphone',
    name: 'phone',
    customValidation: { required: true, minlength: 8, pattern: '[+0-9]{8,12}' },
  },
];
