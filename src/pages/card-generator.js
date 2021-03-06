import { inject, BindingEngine } from "aurelia-framework";
import { Router } from 'aurelia-router';
import { BingoCardService } from '../service/bingo-card-service';

@inject(BingoCardService, BindingEngine, Router)
export class CardGenerator { 
    cardCount = 15;
       
    constructor(bingoCardService, bindingEngine, router) {
        this.bingoCardService = bingoCardService;  
        this.bindingEngine = bindingEngine; 
        this.router = router;
    }
    
    /*
    *
    */
    activate(params) {
        if(params.id === 'custom') {
            let promise = new Promise((resolve, reject) => {
                this.words = this.bingoCardService.getCustomBingoThemeWords();
                this.cards = this.getGeneratedCards(this.cardCount, this.words);
                this.subscription = this.bindingEngine.propertyObserver(this, 'cardCount')
                                                      .subscribe( (newValue, oldValue) => {
                                                          this.cards = this.getGeneratedCards(this.cardCount, this.words);
                                                      });
                resolve();
            });
            
            return promise;
        }
        
        return this.bingoCardService.getBingoThemeById(Number(params.id))
                                    .then(theme => this.theme = theme)
                                    .then( () => {
                                        this.cards = this.getGeneratedCards(this.cardCount, this.theme.words);
                                        this.subscription = this.bindingEngine.propertyObserver(this, 'cardCount')
                                                                              .subscribe( (newValue, oldValue) => {
                                                                                  this.cards = this.getGeneratedCards(this.cardCount, this.theme.words);
                                                                              });
                                    });
    }
    
    /**
     * Clean up resources
     */
    deactivate() {
        this.subscription.dispose();
    }
    
    /**
    * Gets a collection of bingo cards
    * @param {Number} count
    * @param {Array} words
    * @return {Array} cards
    */
    getGeneratedCards(count, words) {
        let cards = [];
        
        for(let i = 0; i < count; i++) {
            cards[i] = this.bingoCardService.getBingoCardData(words);
        }
        
        return cards;
    }
    
    /**
    * Launch the browser's print dialog
    */
    print () {
        window.print();
    }
    
    /**
     * Return to the previous route
     */
    back() {
        this.router.navigateBack();
    }
}