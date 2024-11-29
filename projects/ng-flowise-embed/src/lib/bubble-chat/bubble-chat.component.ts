import { Component, computed, ElementRef, inject, input, OnDestroy, OnInit, Renderer2, signal } from '@angular/core';
import { BubbleProps } from 'flowise-embed';
import { BubbleTheme } from 'flowise-embed/dist/features/bubble/types';

@Component({
  selector: 'ng-flowise-bubble-chat',
  standalone: true,
  imports: [],
  providers: [],
  templateUrl: './bubble-chat.component.html',
  styleUrl: './bubble-chat.component.css'
})
export class BubbleChatComponent implements OnInit , OnDestroy {
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
      this.renderer.removeChild(document.body, this.bubbleElement);
    }
  }

  private attachBubbleToDom() {
    if (!this.isInitialized) return;
    this.bubbleElement = this.renderer.createElement('flowise-chatbot') as HTMLElement;
    this.injectPropsToElement(this.bubbleElement, this.bubbleProps());
    this.renderer.appendChild(document.body, this.bubbleElement);
  }

  private injectPropsToElement(element: HTMLElement, props: BubbleProps | undefined) {
    Object.assign(element, props);
  }
}
