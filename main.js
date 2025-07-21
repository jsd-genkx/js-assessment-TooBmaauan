"use strict";

// นำเข้าโมดูลที่จำเป็น
import promptSync from "prompt-sync";
import clear from "clear-screen";

const prompt = promptSync({ sigint: true }); // กำหนดฟังก์ชัน prompt สำหรับรับ input

// กำหนดสัญลักษณ์สำหรับองค์ประกอบต่างๆ ในสนาม
const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

class Field {
  constructor(field = [[]]) {
    this.field = field; // เก็บสถานะของสนาม
    this.positionRow = 0; // ตำแหน่งแถวปัจจุบันของผู้เล่น (เริ่มต้นที่ 0)
    this.positionCol = 0; // ตำแหน่งคอลัมน์ปัจจุบันของผู้เล่น (เริ่มต้นที่ 0)
    this.field[this.positionRow][this.positionCol] = pathCharacter; // ทำเครื่องหมายตำแหน่งเริ่มต้นของผู้เล่น
  }

  print() {
    clear();

    // ใช้ .join('') เพื่อรวมองค์ประกอบในแถวให้เป็นสตริงเดียว (ไม่มีคอมม่า)
    this.field.forEach((row) => {
      console.log(row.join(''));
    });
  }

  isInBounds(row, col) {
    return (
      row >= 0 &&
      row < this.field.length &&
      col >= 0 &&
      col < this.field[0].length
    );
  }

  isHat() {
    return this.field[this.positionRow][this.positionCol] === hat;
  }

  isHole() {
    return this.field[this.positionRow][this.positionCol] === hole;
  }

  playGame() {
    let playing = true;

    while (playing) {
      this.print();

      const move = prompt(
        "คุณต้องการไปทางไหน? (W: ขึ้น, S: ลง, A: ซ้าย, D: ขวา) "
      ).toUpperCase();

      // กำหนดตำแหน่งใหม่ตาม input
      let newRow = this.positionRow;
      let newCol = this.positionCol;

      switch (move) {
        case "W":
          newRow -= 1;
          break;
        case "S":
          newRow += 1;
          break;
        case "A":
          newCol -= 1;
          break;
        case "D":
          newCol += 1;
          break;
        default:
		  console.log("คำสั่งไม่ถูกต้อง กรุณาใส่ W, S, A, หรือ D");
          continue;
      }
	
      // ตรวจสอบว่าตำแหน่งใหม่ยังอยู่ในขอบเขตของสนามหรือไม่
      if (!this.isInBounds(newRow, newCol)) {
        console.log("Loses by moving outside the field");
        playing = false;
        break; 
      }

      // อัปเดตตำแหน่งผู้เล่น
      this.positionRow = newRow;
      this.positionCol = newCol;

      // ตรวจสอบเงื่อนไขการชนะ/แพ้
      if (this.isHole()) {
        this.field[this.positionRow][this.positionCol] = hole;
        this.print();
        console.log("Loses by landing on a hole");
        playing = false;
      } else if (this.isHat()) {
        this.field[this.positionRow][this.positionCol] = hat;
        this.print(); 
        console.log("Wins by finding the hat");
        playing = false;
      } else {
        // ถ้ายังไม่ชนะหรือแพ้ ให้ทำเครื่องหมายเส้นทางที่เดินผ่าน
        this.field[this.positionRow][this.positionCol] = pathCharacter;
      }
    }
  }

  
  static generateField(height, width, holePercentage) {
    // สร้างสนามเปล่าที่เต็มไปด้วย fieldCharacter
    const field = Array(height)
      .fill(0)
      .map(() => Array(width).fill(fieldCharacter));

    // วางหมวก (hat) แบบสุ่ม
    let hatRow, hatCol;
    do {
      hatRow = Math.floor(Math.random() * height);
      hatCol = Math.floor(Math.random() * width);
    } while (hatRow === 0 && hatCol === 0);
    field[hatRow][hatCol] = hat;

    // วางหลุม (holes) แบบสุ่ม
    const totalCells = height * width;
    const numHoles = Math.floor(totalCells * holePercentage);

    let holesPlaced = 0;
    while (holesPlaced < numHoles) {
      const holeRow = Math.floor(Math.random() * height);
      const holeCol = Math.floor(Math.random() * width);

      // ตรวจสอบว่าตำแหน่งที่จะวางหลุมไม่ใช่ตำแหน่งเริ่มต้นของผู้เล่นหรือหมวก
      if (
        (holeRow !== 0 || holeCol !== 0) &&
        field[holeRow][holeCol] === fieldCharacter
      ) {
        field[holeRow][holeCol] = hole;
        holesPlaced++;
      }
    }

    return field;
  }
}

// สร้างสนามแบบสุ่ม (เช่น สูง 10, กว้าง 10, มีหลุม 20%)
const myField = Field.generateField(7, 7, 0.2);

// สร้างอินสแตนซ์ของเกม
const game = new Field(myField);

// เริ่มเล่นเกม
game.playGame();
