/**
 * Una tubería personalizada que desinfecta el contenido HTML o las URL de recursos para evitar ataques de secuencias de comandos entre sitios (XSS).
 * Esta tubería utiliza DomSanitizer de Angular para evitar la seguridad y marcar el contenido como seguro.
 */
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {

  /**
   * Construye una nueva instancia de SafeHtmlPipe.
   * @param sanitizer: el servicio DomSanitizer proporcionado por Angular.
   */
  constructor(private sanitizer: DomSanitizer) { }

  /**
   * Transforma el valor de entrada desinfectándolo según el tipo especificado.
   * @param value: el valor de entrada que se va a desinfectar.
   * @param type: el tipo de desinfección que se aplicará. El valor predeterminado es 'html'.
   * @returns El valor desinfectado como objeto SafeResourceUrl o SafeHtml.
   */
  public transform(value: string, type?: string): SafeResourceUrl | SafeHtml {
    if (type === 'base64') {
      return this.sanitizer.bypassSecurityTrustResourceUrl(value);
    } else {
      return this.sanitizer.bypassSecurityTrustHtml(value);
    }
  }
}
