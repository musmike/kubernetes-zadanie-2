import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  template: `
    <div>
      <header class="masthead" style="background-image: url('https://cdn.who.int/media/images/default-source/imported/contact-us.tmb-1200v.jpg?sfvrsn=fa0e6c6e_7')">
        <div class="container position-relative px-4 px-lg-5">
          <div class="row gx-4 gx-lg-5 justify-content-center">
            <div class="col-md-10 col-lg-8 col-xl-7">
              <div class="site-heading text-center text-white pt-5">
                <h1>Kontakt</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main class="mb-4">
        <div class="container px-4 px-lg-5">
          <div class="row gx-4 gx-lg-5 justify-content-center">
            <div class="col-md-10 col-lg-8 col-xl-7 text-center">
              <p>
                <strong>Sklep Wędkarski "Wędka Marzeń"</strong><br />
                Adres: ul. Wędkarska 123, 00-000 Miastowo<br />
                Telefon: +48 123 456 789<br />
                E-mail: info&#64;wedkamarzen.pl<br />
              </p>
              <p>
                <strong>Godziny otwarcia:</strong><br />
                Poniedziałek - Piątek: 9:00 - 18:00<br />
                Sobota: 10:00 - 15:00<br />
                Niedziela: Zamknięte<br />
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class ContactComponent {}