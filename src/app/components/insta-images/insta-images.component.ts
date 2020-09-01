import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { transition, state, animate, style, trigger, query, stagger} from '@angular/animations';

@Component({
  selector: 'app-insta-images',
  templateUrl: './insta-images.component.html',
  styleUrls: ['./insta-images.component.scss'],
  animations: [
    trigger('newTrigger', [
      transition(':enter', [
        query('.effect', [
          style({ opacity: 0, transform: 'translateX(-100px)'}),
          stagger(100, [
            animate('1000ms cubic-bezier(0.35, 0, 0.25, 1)', style({opacity: 1, transform: 'none'}))
          ])
        ], { optional: true })
      ]),
      transition(':leave', [
        animate('1000ms', style({opacity: 0}))
      ]),
    ]),
  ]
})
export class InstaImagesComponent implements OnInit {
  @HostBinding('@newTrigger')
  @Input() images: any;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 1,
    grabCursor: 'true',
    effect: 'fade',
    loop: true,
    autoplay: {
      delay: 100000,
      disableOnInteraction: false
    },
    on: {
      beforeInit() {
        const swiper = this;
        swiper.classNames.push(`${swiper.params.containerModifierClass}fade`);
        const overwriteParams = {
          slidesPerView: 1,
          slidesPerColumn: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          spaceBetween: 0,
          virtualTranslate: true,
        };
        swiper.params = Object.assign(swiper.params, overwriteParams);
        swiper.params = Object.assign(swiper.originalParams, overwriteParams);
      },
      setTranslate() {
        const swiper = this;
        const { slides } = swiper;
        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = swiper.slides.eq(i);
          const offset$$1 = $slideEl[0].swiperSlideOffset;
          let tx = -offset$$1;
          if (!swiper.params.virtualTranslate) tx -= swiper.translate;
          let ty = 0;
          if (!swiper.isHorizontal()) {
            ty = tx;
            tx = 0;
          }
          const slideOpacity = swiper.params.fadeEffect.crossFade
            ? Math.max(1 - Math.abs($slideEl[0].progress), 0)
            : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
          $slideEl
            .css({
              opacity: slideOpacity,
            })
            .transform(`translate3d(${tx}px, ${ty}px, 0px)`);
        }
      },
      setTransition(duration) {
        const swiper = this;
        const { slides, $wrapperEl } = swiper;
        slides.transition(duration);
        if (swiper.params.virtualTranslate && duration !== 0) {
          let eventTriggered = false;
          slides.transitionEnd(() => {
            if (eventTriggered) return;
            if (!swiper || swiper.destroyed) return;
            eventTriggered = true;
            swiper.animating = false;
            const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
            for (let i = 0; i < triggerEvents.length; i += 1) {
              $wrapperEl.trigger(triggerEvents[i]);
            }
          });
        }
      },
    }
  };
  
  slideImages = [];
  constructor() { }

  ngOnInit() {
    const slideCount = 8;
    const slideImageCount = 5;
    for (let i = 0; i < slideCount ; i ++) {
      this.slideImages[i] = [];
      for(let j = 0; j < slideImageCount; j ++) {
        this.slideImages[i].push(this.images[(slideImageCount * i + j) % this.images.length]);
      }
    }
  }

  openMedia(media) {
    window.open(media.link, '_blank');
  }
}