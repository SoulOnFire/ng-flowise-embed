import { Component, computed, ElementRef, inject, input, OnDestroy, OnInit, Renderer2, signal, ViewEncapsulation } from '@angular/core';
import { BubbleProps } from 'flowise-embed';
import { BubbleTheme } from 'flowise-embed/dist/features/bubble/types';


@Component({
  selector: 'ng-flowise-full-page-chat',
  standalone: true,
  imports: [],
  template: '<ng-container></ng-container>',
  styleUrl: './full-page-chat.component.css',
  encapsulation: ViewEncapsulation.None
})
export class FullPageChatComponent  implements OnInit , OnDestroy {
  constructor() {}

  isInitialized = signal(false);
  chatflowid = input.required<string>();
  apiHost = input<string>();
  theme = input<BubbleTheme>();
  chatflowConfig = input<Record<string, unknown>>();


  bubbleProps  = computed<BubbleProps>(() => ({chatflowid: this.chatflowid(), apiHost: this.apiHost(), theme: this.theme(), chatflowConfig: this.chatflowConfig()}));
  private bubbleElement: HTMLElement | null = null;
  
  protected renderer = inject(Renderer2);
  protected element = inject(ElementRef);

  async ngOnInit() {
    await import('flowise-embed/dist/web.js');
    this.isInitialized.set(true);
    this.attachBubbleToDom();
  }

  ngOnDestroy() {
    if (this.bubbleElement) {
      this.renderer.removeChild(this.element.nativeElement, this.bubbleElement);
    }
  }

  private attachBubbleToDom() {
    if (!this.isInitialized) return;
    this.bubbleElement = this.renderer.createElement('flowise-fullchatbot') as HTMLElement;
    this.injectPropsToElement(this.bubbleElement, this.bubbleProps());
    this.renderer.appendChild(this.element.nativeElement, this.bubbleElement);
  }

  private injectPropsToElement(element: HTMLElement, props: BubbleProps | undefined) {
    Object.assign(element, props);
  }
}
