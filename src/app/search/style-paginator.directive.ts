import {
  ElementRef,
  AfterViewInit,
  Directive,
  Host,
  Optional,
  Renderer2,
  Self,
  ViewContainerRef,
  Input
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatButton } from '@angular/material/button';

interface PageObject {
  length: number;
  pageIndex: number;
  pageSize: number;
  previousPageIndex: number;
}

@Directive({
  selector: '[style-paginator]'
})
export class StylePaginatorDirective {
  private pageGapTxt = '...';
  private rangeStart: number;
  private rangeEnd: number;
  private buttons = [];
  private curPageObj: PageObject = {
    length: 0,
    pageIndex: 0,
    pageSize: 0,
    previousPageIndex: 0
  };

  @Input()
  get showTotalPages(): number {
    return this._showTotalPages;
  }
  set showTotalPages(value: number) {
    this._showTotalPages = value % 2 == 0 ? value + 1 : value;
  }
  public _showTotalPages = 2;

  get inc(): number {
    return this._showTotalPages % 2 == 0
      ? this.showTotalPages / 2
      : (this.showTotalPages - 1) / 2;
  }

  get numOfPages(): number {
    return this.matPag.getNumberOfPages();
  }

  get lastPageIndex(): number {
    return this.matPag.getNumberOfPages() - 1;
  }

  constructor(
    @Host() @Self() @Optional() private readonly matPag: MatPaginator,
    private vr: ViewContainerRef,
    private ren: Renderer2
  ) {
    // to rerender buttons on items per page change and first, last, next and prior buttons
    this.matPag.page.subscribe((e: PageObject) => {
      if (
        this.curPageObj.pageSize != e.pageSize &&
        this.curPageObj.pageIndex != 0
      ) {
        e.pageIndex = 0;
        this.rangeStart = 0;
        this.rangeEnd = this._showTotalPages - 1;
      }
      this.curPageObj = e;

      this.initPageRange();
    });
  }

  private buildPageNumbers() {
    const actionContainer = this.vr.element.nativeElement.querySelector(
      'div.mat-paginator-range-actions'
    );
    const nextPageNode = this.vr.element.nativeElement.querySelector(
      'button.mat-paginator-navigation-next'
    );
    const prevButtonCount = this.buttons.length;

    // remove buttons before creating new ones
    if (this.buttons.length > 0) {
      this.buttons.forEach(button => {
        this.ren.removeChild(actionContainer, button);
      });
      // Empty state array
      this.buttons.length = 0;
    }

    // initialize next page and last page buttons
    if (this.buttons.length == 0) {
      const nodeArray = this.vr.element.nativeElement.childNodes[0].childNodes[0]
        .childNodes[2].childNodes;
      setTimeout(() => {
        for (let i = 0; i < nodeArray.length; i++) {
          if (nodeArray[i].nodeName === 'BUTTON') {
            if (nodeArray[i].innerHTML.length > 100 && nodeArray[i].disabled) {
              this.ren.setStyle(
                nodeArray[i],
                'background-color',
                'rgba(190, 130, 130, 1)'
              );
              this.ren.setStyle(nodeArray[i], 'color', 'white');
              this.ren.setStyle(nodeArray[i], 'margin', '.5%');
            } else if (
              nodeArray[i].innerHTML.length > 100 &&
              !nodeArray[i].disabled
            ) {
              this.ren.setStyle(
                nodeArray[i],
                'background-color',
                'rgb(83,191,180)'
              );
              this.ren.setStyle(nodeArray[i], 'color', 'white');
              this.ren.setStyle(nodeArray[i], 'margin', '.5%');
            } else if (nodeArray[i].disabled) {
              // console.log('nodearray....', nodeArray[i].textContent, nodeArray[i].innerHTML);
              if (nodeArray[i].textContent === this.pageGapTxt) {
                // console.log('nodearray....true....');
                this.ren.setStyle(nodeArray[i], 'background-color', 'rgba(0,0,0,0)');
                this.ren.setStyle(nodeArray[i], 'color', 'rgb(0,0,0)');

              } else {
                this.ren.setStyle(nodeArray[i], 'background-color', '#53BFB4');
              }
            }
          }
        }
      });
    }

    for (let i = 0; i < this.numOfPages; i++) {
      if (i >= this.rangeStart && i <= this.rangeEnd) {
        this.ren.insertBefore(
          actionContainer,
          this.createButton(i, this.matPag.pageIndex),
          nextPageNode
        );
      }

      if (i == this.rangeEnd) {
        this.ren.insertBefore(
          actionContainer,
          this.createButton(this.pageGapTxt, this.rangeEnd),
          nextPageNode
        );
      }
    }
  }

  private createButton(i: any, pageIndex: number): any {
    const linkBtn: MatButton = this.ren.createElement('button');
    this.ren.addClass(linkBtn, 'mat-mini-fab');
    this.ren.setStyle(linkBtn, 'margin', '1%');
    this.ren.setStyle(linkBtn, 'background-color', 'white');

    const pagingTxt = isNaN(i) ? this.pageGapTxt : +(i + 1);
    const text = this.ren.createText(pagingTxt + '');

    this.ren.addClass(linkBtn, 'mat-custom-page');
    switch (i) {
      case pageIndex:
        this.ren.setAttribute(linkBtn, 'disabled', 'disabled');
        break;
      case this.pageGapTxt:
        let newIndex = this.curPageObj.pageIndex + this._showTotalPages;

        if (newIndex >= this.numOfPages) { newIndex = this.lastPageIndex; }

        if (pageIndex != this.lastPageIndex) {
          this.ren.listen(linkBtn, 'click', () => {
            // console.log('working: ', pageIndex);
            this.switchPage(newIndex);
          });
        }

        if (pageIndex == this.lastPageIndex) {
          this.ren.setAttribute(linkBtn, 'disabled', 'disabled');
        }
        break;
      default:
        this.ren.listen(linkBtn, 'click', () => {
          this.switchPage(i);
        });
        break;
    }

    this.ren.appendChild(linkBtn, text);
    // Add button to private array for state
    this.buttons.push(linkBtn);
    return linkBtn;
  }
  // calculates the button range based on class input parameters and based on current page index value. Used to render new buttons after event.
  private initPageRange(): void {
    const middleIndex = (this.rangeStart + this.rangeEnd) / 2;

    this.rangeStart = this.calcRangeStart(middleIndex);
    this.rangeEnd = this.calcRangeEnd(middleIndex);

    this.buildPageNumbers();
  }

  // Helper function To calculate start of button range
  private calcRangeStart(middleIndex: number): number {
    switch (true) {
      case this.curPageObj.pageIndex == 0 && this.rangeStart != 0:
        return 0;
      case this.curPageObj.pageIndex > this.rangeEnd:
        return this.curPageObj.pageIndex + this.inc > this.lastPageIndex
          ? this.lastPageIndex - this.inc * 2
          : this.curPageObj.pageIndex - this.inc;
      case this.curPageObj.pageIndex > this.curPageObj.previousPageIndex &&
      this.curPageObj.pageIndex > middleIndex &&
      this.rangeEnd < this.lastPageIndex:
        return this.rangeStart + 1;
      case this.curPageObj.pageIndex < this.curPageObj.previousPageIndex &&
      this.curPageObj.pageIndex < middleIndex &&
      this.rangeStart > 0:
        return this.rangeStart - 1;
      default:
        return this.rangeStart;
    }
  }
  // Helpter function to calculate end of button range
  private calcRangeEnd(middleIndex: number): number {
    switch (true) {
      case this.curPageObj.pageIndex == 0 &&
      this.rangeEnd != this._showTotalPages:
        return this._showTotalPages - 1;
      case this.curPageObj.pageIndex > this.rangeEnd:
        return this.curPageObj.pageIndex + this.inc > this.lastPageIndex
          ? this.lastPageIndex
          : this.curPageObj.pageIndex + 1;
      case this.curPageObj.pageIndex > this.curPageObj.previousPageIndex &&
      this.curPageObj.pageIndex > middleIndex &&
      this.rangeEnd < this.lastPageIndex:
        return this.rangeEnd + 1;
      case this.curPageObj.pageIndex < this.curPageObj.previousPageIndex &&
      this.curPageObj.pageIndex < middleIndex &&
      this.rangeStart >= 0 &&
      this.rangeEnd > this._showTotalPages - 1:
        return this.rangeEnd - 1;
      default:
        return this.rangeEnd;
    }
  }
  // Helper function to switch page on non first, last, next and previous buttons only.
  private switchPage(i: number): void {
    // console.log('switch', i);
    const previousPageIndex = this.matPag.pageIndex;
    this.matPag.pageIndex = i;
    this.matPag._emitPageEvent(previousPageIndex);
    this.initPageRange();
  }
  // Initialize default state after view init
  public ngAfterViewInit() {
    this.rangeStart = 0;
    this.rangeEnd = this._showTotalPages - 1;
    this.initPageRange();
  }
}
