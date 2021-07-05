import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  private puzzleBoard: PuzzleBoard;
  private cellSwapper: CellSwapperEventArgs;

  private gameTimer: Timer = new Timer();

  private musicSound = new Audio('../../assets/music.mp3');

  public score = 0;

  public time = this.gameTimer.Time;

  constructor() {
    this.puzzleBoard = new PuzzleBoard();
    this.puzzleBoard.initializePuzzleBoard(2);
    this.cellSwapper = new CellSwapperEventArgs();
    this.gameTimer.startTimer(this.IsPuzzleSolved());
    this.ShowTime();
    // this.musicSound.play();
  }

  public get Cells(): Cell[] {
    return this.puzzleBoard.Cells;
  }

  private CalculateScore() : number{
    let score: number;
    score = 100 - this.time;
    if (score < 0) {
      return 0;
    }
    return score;
  }

  private ShowTime() : void {
    if (!this.IsPuzzleSolved()) {
      this.time = this.gameTimer.Time;

      setTimeout(() => {
        this.ShowTime();
        this.score = this.CalculateScore();
      }, 1000);
    }
  }

  private ChangeOpacity(cell): void {
    this.puzzleBoard.Cells.forEach((element) => {
      if (element.ID === cell.target.id) {
        element.SetOpacity('0.5');
      }
    });
  }

  public IsPuzzleSolved(): boolean {
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

    this.ChangeOpacity(cell);

    this.puzzleBoard.SetCells(
      this.cellSwapper.FireCellSwapperEvent(this.puzzleBoard.Cells)
    );

    if (this.IsPuzzleSolved()) {
      console.log('Won');
      this.musicSound.pause();
    } else {
      console.log('Not yet');
    }
  }

  ngOnInit(): void { }
}

class Timer {

  private time: number;

  constructor() { this.time = 0 }

  public get Time(): number {
    return this.time;
  }

  private setTime(time: number) {
    this.time = time;
  }


  public startTimer(isGameFinished: boolean) {
    if (!isGameFinished) {
      this.setTime(this.Time + 1);
      setTimeout(() => {
        this.startTimer(isGameFinished);
      }, 1000);
    }
  }
}

class CellSwapperEventArgs {
  private ResetOpacity(cells): Cell[] {
    cells.forEach((element) => {
      if (element.Opacity === '0.5') {
        element.SetOpacity('1');
      }
    });
    return cells;
  }

  public FireCellSwapperEvent(cells: Cell[]): Cell[] {
    let counter = 0;
    let cellOne!: Cell;
    let indexOfFirstSelectedCell!: number;
    let indexOfSecondSelectedCell!: number;

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
