# 🧮 Calculator Lab

This project is a simple **calculator application** built with **HTML, CSS, and JavaScript** as part of a lab exercise for learning fundamental programming and UI concepts.

The calculator simulates a basic Microsoft Windows OS-style calculator and demonstrates:

- Implementing arithmetic functions in JavaScript  
- Managing application state and user input  
- Storing and displaying a **history of calculations**  
- Evaluating expressions with **BODMAS** (including brackets)  
- Building a small, self-contained UI with a **dark theme**

---

## 🎯 Lab Objectives

1. **Implement functions** for:
   - Addition
   - Subtraction
   - Multiplication
   - Division (with basic divide-by-zero handling)

2. **Store each calculation’s details** in an array.

3. **Display a history of calculations** to the user.

This project also goes beyond the basic objectives by adding:

- A **BODMAS-aware expression evaluator** (e.g. `2 + 3 * 4` → `14`)
- Support for **brackets `( )`** in expressions
- A **dark-themed calculator UI**
- A **history overlay panel** that appears inside the calculator, on top of the buttons

---

## 📁 Project Structure

```text
calculator/
├── index.html    # Markup for the calculator UI
├── style.css     # Dark theme and layout styling
└── script.js     # Calculator logic + BODMAS + history
