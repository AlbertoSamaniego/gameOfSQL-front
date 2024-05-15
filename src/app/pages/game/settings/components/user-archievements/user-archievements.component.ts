import { Component, OnInit } from '@angular/core';
import { Archievement } from '../../../../../shared/interfaces/archievement.interface';
import { endpoints } from '../../../../../shared/constants/end-points';
import { User } from '../../../../../shared/interfaces/user.interface';
import { ArchievementService } from '../../../../../shared/services/archievement/archievements.service';
import { AuthService } from '../../../../../shared/services/user/auth-service.service';

/**
 * Representa el componente de los logros del usuario.
 */
@Component({
  selector: 'app-user-archievements',
  templateUrl: './user-archievements.component.html',
  styleUrl: './user-archievements.component.scss'
})
export class UserArchievementsComponent implements OnInit{

  public archievements: Archievement[] = [];
  public currentUser: User = {} as User;

  constructor( private authService: AuthService, private archievementService: ArchievementService ) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser;
    this.getArchievements();
  }

  /**
   * Representa los logros.
   */
  representArchievements() {
    this.archievements.forEach(archievement => {
      if(!this.currentUser.archievements_id.includes(archievement.id)) {
        this.setArchievementToUnknown(archievement);
      }else{
        archievement.image = this.filterNameArchievementImage(archievement.image);
        archievement.image = `${endpoints.urlImageArchievement}${archievement.image}`;
      }
    });
  }

  /**
   * Obtiene los logros.
   */
  getArchievements() {
    this.archievementService.getArchievements().subscribe((archievements) => {
      this.archievements = archievements;
      this.representArchievements();
    });
  }

  /**
   * Verifica si el logro está desbloqueado.
   * @param archievement - El logro a verificar.
   * @returns True si el logro está desbloqueado, de lo contrario, false.
   */
  isArchievementUnlock(archievement: Archievement) {
    return this.currentUser.archievements_id.includes(archievement.id);
  }

  /**
   * Establece el logro como desconocido.
   * @param archievement - El logro a establecer como desconocido.
   */
  setArchievementToUnknown(archievement: Archievement) {
    archievement.title = '????????';
    archievement.description = '????????????????????';
    archievement.image = '../../../assets/game/archievement/unknown.png'
  }

  /**
   * Filtra el nombre de la imagen del logro.
   * @param fullUrl - La URL completa de la imagen del logro.
   * @returns El nombre de la imagen del logro.
   */
  filterNameArchievementImage(fullUrl: string): string {
    return fullUrl.replace('sites/default/files/2024-04/', '')?.replace('/', '') || '';
  }
}
