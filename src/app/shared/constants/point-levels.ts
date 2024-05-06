export const levels = [
  {
    "level": 1,
      "points": [
        {
          "id": "1",
          "description": "Punto inicial, no hay variantes",
          "nextPoints": ["2.1", "2.2"],
        }
      ]
  },
  {
    "level": 2,
      "points": [
        {
          "id": "2.1",
          "nextPoints": ["3.1", "3.2"],
          "variants": [
            {
              "id": "2.1.1",
              "description": "Haber acertado el punto 1",
            },
            {
              "id": "2.1.2",
              "description": "No haber acertado el punto 1",
            }
          ]
        },
        {
          "id": "2.2",
          "nextPoints": ["3.3", "3.4", "3.5"],
          "variants": [
            {
              "id": "2.2.1",
              "description": "Haber acertado el punto 1",
            },
            {
              "id": "2.2.2",
              "description": "No haber acertado el punto 1",
            }
          ]
        }
      ]
  },
  {
    "level": 3,
      "points": [
        {
          "id": "3.1",
          "nextPoints": ["3.2"],
          "description": "Punto unico, no tiene condiciones previas. Si se visita el punto 3.2 ya no esta disponible en el mapa",
        },
        {
          "id": "3.2",
          "nextPoints": ["4.1"],
          "variants": [
            {
              "id": "3.2.1",
              "description": "Haber acertado el punto 1 y punto 3.1",
            },
            {
              "id": "3.2.2",
              "description": "Haber acertado el punto 1 y no el punto 3.2",
            },
            {
              "id": "3.2.3",
              "description": "No haber acertado el punto 1 y no haber acertado el punto 3.1",
            }
          ]
        },
        {
          "id": "3.3",
          "nextPoints": ["3.4", "3.5"],
          "description": "Punto unico, no tiene condiciones previas. Si se visita el punto 3.4 o 3.5 ya no esta disponible en el mapa",
        },
        {
          "id": "3.4",
          "nextPoints": ["4.2"],
          "variants": [
            {
              "id": "3.4.1",
              "description": "Haber acertado el punto 1 y el 2.2",
            },
            {
              "id": "3.4.2",
              "description": "Haber acertado el punto 1 y no el 2.2",
            },
            {
              "id": "3.4.3",
              "description": "No haber acertado el punto 1 y si  el 2.2",
            },
            {
              "id": "3.4.4",
              "description": "No haber acertado el punto 1 y no el 2.2",
            }
          ]
        },
        {
          "id": "3.5",
          "nextPoints": ["4.2"],
          "description": "No tiene variantes",
        }
      ]
  },
  {
    "level": 4,
      "points": [
        {
          "id": "4.1",
          "nextPoints": ["5.1"],
          "variants": [
            {
              "id": "4.1.1",
              "description": "Haber acertado el punto 3.2",
            },
            {
              "id": "4.1.2",
              "description": "No haber acertado el punto 3.2",
            }
          ]
        },
        {
          "id": "4.2",
          "nextPoints": ["5.2"],
          "variants": [
            {
              "id": "4.2.1",
              "description": "Haber acertado el punto 3.4",
            },
            {
              "id": "4.2.2",
              "description": "No haber acertado el punto 3.4",
            },
            {
              "id": "4.2.3",
              "description": "Haber acertado el punto 3.5",
            },
            {
              "id": "4.2.4",
              "description": "No haber acertado el punto 3.5",
            }
          ]
        }
      ]
  },
  {
    "level": 5,
      "points": [
        {
          "id": "5.1",
          "variants": [
            {
              "id": "5.1.1",
              "description": "Haber acertado el punto 2.1, 3.1 pero no el 4.1",
            },
            {
              "id": "5.1.2",
              "description": "Haber acertado el punto 2.1, 3.1 y 4.1",
            },
            {
              "id": "5.1.3",
              "description": "No haber acertado el punto 2.1, 3.1 y 4.1",
            },
            {
              "id": "5.1.4",
              "description": "No haber acertado el punto 2.1, 3.1 y si el 4.1",
            },
            {
              "id": "5.1.5",
              "description": "No haber acertado el punto 2.1 y si el 3.1 y 4.1",
            },
            {
              "id": "5.1.6",
              "description": "No haber acertado el punto 2.1 y 4.1 y si el 3.1",
            }
          ]
        },
        {
          "id": "5.2",
          "variants": [
            {
              "id": "5.2.1",
              "description": "Haber acertado el punto 4.1",
            },
            {
              "id": "5.2.2",
              "description": "No haber acertado el punto 4.1",
            },
          ]
        }
      ]
  }
];
