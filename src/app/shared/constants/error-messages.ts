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
        type: 'notEqual',
        message: 'Las contraseñas no coinciden'
      },
    ]
  },
  {
    name: 'newEmail',
    errors: [
      {
        type: 'required',
        message: 'El correo es obligatorio'
      },
      {
        type: 'pattern',
        message: 'El email debe de ser válido'
      },
    ]
  },
  {
    name: 'confirmEmail',
    errors: [
      {
        type: 'required',
        message: 'La correo es obligatoria'
      },
      {
        type: 'notEqual',
        message: 'Los correos no coinciden'
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
  },
  {
    name: 'name',
    errors: [
      {
        type: 'required',
        message: 'El nombre es obligatorio'
      },
    ]
  },
  {
    name: 'nickname',
    errors: [
      {
        type: 'required',
        message: 'El apodo es obligatorio'
      },
    ]
  },
  {
    name: 'house',
    errors: [
      {
        type: 'required',
        message: 'El nombre de la casa es obligatorio'
      },
    ]
  },
  {
    name: 'motto',
    errors: [
      {
        type: 'required',
        message: 'Las palabras de las casa son obligatorias'
      },
    ]
  },
  {
    name: 'confirmPassword',
    errors: [
      {
        type: 'required',
        message: 'La contraseña es obligatoria'
      },
      {
        type: 'notEqual',
        message: 'Las contraseñas no coinciden'
      },
    ]
  }
]
