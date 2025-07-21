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
      console.log(row.join(""));
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
	}
}
