import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})

export class GameComponent implements OnInit {
  private puzzleBoard: PuzzleBoard = new PuzzleBoard();
  private cellSwapper: CellSwapperEventArgs;
  // private gameTimer: Timer = new Timer();

  cells = this.puzzleBoard.Cells;

  noOfTries = 0;
  time = 0;
  // time = this.gameTimer.time;
  private counter: number; // when counter = 2 the can two images be swapped

  constructor() {
    this.puzzleBoard.initializePuzzleBoard(2);
    this.cellSwapper = new CellSwapperEventArgs();
    // this.gameTimer.startTimer();
  }

  private ChangeOpacity(cell : Cell): void {
    this.puzzleBoard.Cells.forEach((element) => {
      if (element.ID === cell.ID) {
        element.SetOpacity('0.5');
      }
    });
  }

  private IsWinner(): boolean {
    const solvedPuzzlesIndex = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    for (let index = 0; index < this.puzzleBoard.Cells.length; index++) {
      if (
        this.puzzleBoard.Cells[index].ID !==
        solvedPuzzlesIndex[index].toString()
      ) {
        return false;
      }
    }

    return true;
  }
  public selectImage(cell): void {
    this.noOfTries++;
    // console.log(cell.target );

    this.ChangeOpacity(new Cell(cell.target.id, cell.target.image, cell.target.opacity));

    this.puzzleBoard.SetCells(
      this.cellSwapper.FireCellSwapperEvent(this.puzzleBoard.Cells)
    );
    if (this.IsWinner()) {
      console.log('Won');
    } else {
      console.log('Not yet');
    }
  }

  ngOnInit(): void {}
}

class Timer {
  private time: number;
  public get Time(): number {
    return this.time;
  }

  public startTimer() {
    // todo
  }
}

class CellSwapperEventArgs {
  
  private ResetOpacity(cells : Cell[]): Cell[] {
    cells.forEach((element) => {
      if (element.Opacity === '0.5') {
        element.SetOpacity('1');
      }
    });
    return cells;
  }

  public FireCellSwapperEvent(cells: Cell[]): Cell[] {
    let counter = 0;
    
    let cellOne: Cell = new Cell("0","none", "1"); // initialized it just to avoid error.

    let indexOfFirstSelectedCell: number = 0;
    let indexOfSecondSelectedCell: number = 0;

    for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
      if (cells[cellIndex].Opacity === '0.5') {
        console.log('test 1 passed');

        if (counter == 0) {
          console.log('test 2 passed');
          indexOfFirstSelectedCell = cellIndex;
          cellOne = cells[cellIndex];
        } else {
          console.log('test 3 passed');
          indexOfSecondSelectedCell = cellIndex;

          cells[indexOfFirstSelectedCell] = cells[cellIndex];
          cells[indexOfSecondSelectedCell] = cellOne;

          cells = this.ResetOpacity(cells);

          break;
        }

        counter++;
      }
    }

    return cells;
  }
}

class PuzzleBoard {
  private totalCells = 9; // field
  private puzzleCells: Cell[] = [];

  constructor() {
    this.puzzleCells.length = this.totalCells;
  }

  public get Cells(): Cell[] {
    return this.puzzleCells;
  }

  public SetCells(cells: Cell[]): void {
    this.puzzleCells = cells;
  }

  private shufflePuzzleParts() {
    const puzzleParts = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let counter = puzzleParts.length;
    while (counter > 0) {
      const index = Math.floor(Math.random() * counter);
      counter--;
      const temp = puzzleParts[counter];
      puzzleParts[counter] = puzzleParts[index];
      puzzleParts[index] = temp;
    }
    return puzzleParts;
  }

  public initializePuzzleBoard(puzzleBoardType: number) {
    console.log(this.puzzleCells);

    let imgFolder: string;

    if (puzzleBoardType == 1) {
      imgFolder = '../../assets/puzzleOne/';
    } else {
      imgFolder = '../../assets/puzzleTwo/';
    }
    let puzzleParts = this.shufflePuzzleParts();
    for (let index = 0; index < this.puzzleCells.length; index++) {
      this.puzzleCells[index] = new Cell(
        puzzleParts[index].toString(),
        imgFolder + 'img' + puzzleParts[index] + '.jpg',
        '1'
      );
    }
  }
}

class Cell {
  private id: string;
  private image: string;
  private opacity: string;

  constructor(id: string, image: string, opacity: string) {
    this.image = image;
    this.id = id;
    this.opacity = opacity;
  }

  public get Image(): string {
    return this.image;
  }

  public get Opacity(): string {
    return this.opacity;
  }

  public SetOpacity(opacity: string): void {
    this.opacity = opacity;
  }

  public SetImage(image: string): void {
    this.image = image;
  }

  public get ID(): string {
    return this.id;
  }
}
