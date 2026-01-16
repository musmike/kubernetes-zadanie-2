import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="custom-modal-overlay" *ngIf="isOpen">
      <div class="custom-modal">
        <button class="custom-modal-close" (click)="onClose.emit()">×</button>
        <div class="custom-modal-content">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-modal-overlay {
      background-color: rgba(0, 0, 0, 0.75);
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    }
    .custom-modal {
      background: white; padding: 20px; border-radius: 4px;
      max-width: 500px; width: 100%; box-shadow: 0 2px 10px rgba(0,0,0,0.1); position: relative;
    }
    .custom-modal-close {
      position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 24px; cursor: pointer;
    }
    .custom-modal-content { text-align: center; }
  `]
})
export class CustomModalComponent {
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();
}