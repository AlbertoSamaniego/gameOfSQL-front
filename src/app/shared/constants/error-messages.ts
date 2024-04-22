export const formMessages = [
  {
    name: 'email',
    errors: [
      {
        type: 'required',
        message: 'El email es obligatorio'
      },
      {
        type: 'pattern',
        message: 'El email debe ser válido'
      },
    ]
  },
  {
    name: 'password',
    errors: [
      {
        type: 'required',
        message: 'La contraseña es obligatoria'
      },
      {
        type: 'pattern',
        message: 'La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y tener al menos 6 caracteres'
      },
    ]
  },
  {
    name: 'repeatPassword',
    errors: [
      {
        type: 'required',
        message: 'La contraseña es obligatoria'
      },
      {
        type: 'passwordMismatch',
        message: 'Las contraseñas no coinciden'
      },
    ]
  },
  {
    name: 'newPassword',
    errors: [
      {
        type: 'required',
        message: 'La contraseña es obligatoria'
      },
      {
        type: 'pattern',
        message: 'La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y tener al menos 6 caracteres'
      },
    ]
  }
]
