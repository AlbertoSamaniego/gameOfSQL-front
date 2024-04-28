import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-game-config',
  templateUrl: './game-config.component.html',
  styleUrl: './game-config.component.scss'
})
export class GameConfigComponent implements OnInit{

  public configGameForm: FormGroup = this.fb.group({
    name: [''],
    house: [''],
    nickname: [''],
    motto: ['']
  });

  constructor( private fb: FormBuilder, ) { }

  ngOnInit() {

  }

  updateGameConfig() {

  }
}
