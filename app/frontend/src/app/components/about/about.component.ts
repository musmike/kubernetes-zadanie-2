import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

declare var lightbox: any;

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <header class="masthead" style="background-image: url('/assets/img/fishing-header.jpg')">
        <div class="container position-relative px-4 px-lg-5">
          <div class="row gx-4 gx-lg-5 justify-content-center">
            <div class="col-md-10 col-lg-8 col-xl-7">
              <div class="site-heading text-center text-white pt-5">
                <h1>Nasz sklep</h1>
                <span class="subheading">Sklep ze sprzętem wędkarskim</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main class="mb-4">
        <div class="container px-4 px-lg-5">
          <div class="row gx-4 gx-lg-5 justify-content-center">
            <div class="col-md-10 col-lg-8 col-xl-7 mb-5">
              <p>Witamy w naszym sklepie wędkarskim - prawdziwym rajskim miejscu dla wszystkich miłośników wędkarstwa!...</p>
              <p>Nasz sklep wędkarski to nie tylko miejsce, w którym można znaleźć szeroki wybór produktów...</p>
              <p>Zapraszamy do odwiedzenia naszego sklepu wędkarskiego i dołączenia do naszej społeczności.</p>
            </div>
          </div>

          <!-- Gallery -->
          <div class="row gx-4 gx-lg-5">
            <div class="col-md-4 mb-4" *ngFor="let i of [1,2,3,4,5,6,7,8,9,10]">
               <a [href]="'/assets/img/about/image' + i + '.jpg'" data-lightbox="galeria" [attr.data-title]="'Obraz ' + i">
                 <img 
                    [src]="'/assets/img/about/image' + i + '.jpg'" 
                    class="w-100 shadow-1-strong rounded" 
                    alt="Obraz {{i}}" 
                    style="height: 250px; object-fit: cover; width: 100%; display: block;"
                 />
               </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class AboutComponent implements AfterViewInit {
  
  ngAfterViewInit() {
    if (typeof lightbox !== 'undefined') {
      lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true,
        'albumLabel': 'Zdjęcie %1 z %2'
      });
    }
  }
}