import React, {
  Component
} from "react";
import './propositionalLogic.css'

const trueCode = "T";
const falseCode = "F";

const andOperators = ["∧", "^"];
const orOperators = ["∨"];
const thenOperators = ["→"];
const ifOnlyOperators = ["⇔"];
const notOperators = ["-", "¬"];
const openParenthesis = ["(", "["]
const closeParenthesis = [")", "]"]

const reservedKeyWords = [];
reservedKeyWords.push(trueCode, falseCode, ...andOperators, ...orOperators, ...thenOperators, ...ifOnlyOperators, ...notOperators,
                      ...openParenthesis, ...closeParenthesis );


class PropositionalLogic extends Component {

  constructor(props) {
    super(props);
    this.addOption = this.addOption.bind(this);
    this.setInputValue = this.setInputValue.bind(this);
    this.setValue = this.setValue.bind(this);
    this.setSelectedOperation = this.setSelectedOperation.bind(this);
    this.addOperation = this.addOperation.bind(this);
    this.resolve = this.resolve.bind(this);
    this.calculateTruthTable = this.calculateTruthTable.bind(this);
    this.getBasicOptions = this.getBasicOptions.bind(this);
    this.executeOperation = this.executeOperation.bind(this);

  }


  state = {
    value: "",
    inputValue: "",
    options: this.getBasicOptions(),
    selectedOperation: andOperators[0],
    truthyTable: []
  }

  getBasicOptions() {
    //for simplicity we are just using the first element of each array, so to reduce complexity, but allow other ways to write it
    let arr = [];
    arr.push(andOperators[0]);
    arr.push(orOperators[0]);
    arr.push(notOperators[0]);
    arr.push(thenOperators[0]);
    arr.push(ifOnlyOperators[0]);
    return arr;
  }

  setInputValue(evt) {
    this.setState({
      inputValue: evt.target.value
    })
  }

  setValue(evt) {
    this.setState({
      value: evt.target.value
    })
  }

  setSelectedOperation(evt) {
    this.setState({
      selectedOperation: evt.target.value
    })
  }

  addOption(evt) {
    let options = this.state.options;
    let variables = this.state.variables;
    let inputValue = this.state.inputValue;
    if (inputValue) {
      if(this.state.options[inputValue]) {
        return {error: "Ya existe una opcion con este nombre, y es de tipo " + this.state.variables[inputValue] ? "variable" : "operacion"};
      }
      options.push(inputValue);
      variables.push(inputValue);
      inputValue = "";
    }
    this.setState({
      inputValue: inputValue,
      variables: [],
      options: options
    });
  }

  addOperation(evt) {
    let value = this.state.value;
    if (value) value += " ";
    value += this.state.selectedOperation;
    this.setState({
      value: value
    });
  }

  resolveOperation(bool1, bool2, operation) {

    if (andOperators.includes(operation)) {
      return bool1 && bool2;
    }

    if (orOperators.includes(operation)) {
      return bool1 || bool2;
    }

    if (notOperators.includes(operation)) {
      return !bool1;
    }

    if (thenOperators.includes(operation)) {
      return !bool1 || bool2;
    }

    if (ifOnlyOperators.includes(operation)) {
      return (bool1 && bool2) || (!bool1 && !bool2);
    }
    return {error: "This operation does not exists: " + operation}
  }

  resolve(value, variablesMap) {
    variablesMap[trueCode] = true;
    variablesMap[falseCode] = false;
    let currentStack = [];
    let parenthesisStack = [];
    let lastChar = "";
    let parenthesisCounter = 0;
    let isVariable = (c) => this.state.variables.includes(c) || c === trueCode || c === falseCode
    for (const c of value) {
      if (c === " " || c === "") continue;

      if (c === "(" || c === "[") {
        if (lastChar && isVariable(lastChar)) {
          return {
            error: "The parenthesis should be used after an operation or at the beginning"
          }
        }
        if (parenthesisCounter) {
          parenthesisStack.push(c);
        }
        parenthesisCounter++;
        continue;
      } else if (c === ")" || c === "]") {
        parenthesisCounter--;
        if (parenthesisCounter) {
          parenthesisStack.push(c);
          lastChar = c;
          continue;
        }
        //estamos en un caso extremo
        //en todo esto hay que revisar cosas como que lo anterior no sea tambien una variable por ejemplo
        let result = this.resolve(parenthesisStack, variablesMap);
        parenthesisStack = [];
        if (typeof result !== "boolean") return result;
        currentStack.push(result ? trueCode : falseCode);
        lastChar = result ? trueCode : falseCode;
        continue;
      } else if (parenthesisCounter) {
        parenthesisStack.push(c);
        continue;
      } else if (notOperators.includes(lastChar)) {
        if (!isVariable(c))
          return {
            error: "The not operator should be used before an expression(between parenthesis) or a variable"
          };

        currentStack.push(c);

        let result = this.resolveOperation(variablesMap[currentStack[1]], false, currentStack[0]);

        if (typeof result !== "boolean") return result;
        currentStack = [result ? trueCode : falseCode];
        lastChar = result ? trueCode : falseCode;
        continue;
      } else if (isVariable(c)) {
        if (lastChar) {
          if (isVariable(lastChar)) {
            return {
              error: "Cannot have variable after variable"
            };
          } else {
            let bool1 = variablesMap[currentStack[0]];
            let bool2 = variablesMap[c];//current character been evaluated
            let result = this.resolveOperation(bool1, bool2, currentStack[1])

            if (typeof result !== "boolean") return result;
            currentStack = [result ? trueCode : falseCode];
            lastChar = result ? trueCode : falseCode;
            continue;
          }
        } else {
          currentStack.push(c);
          lastChar = c;
          continue;
        }
      } else {
        //operation
        if(!lastChar) {
          if(notOperators.includes(c)) {
            currentStack.push(c);
            lastChar = c;
            continue;
          }
          return {
            error: "Cannot have operation after nothing"
          };
        }

        if(!isVariable(lastChar))
        return {
          error: "Cannot have operation after operation"
        };
        currentStack.push(c);
        lastChar = c;
      }
    }
    if(currentStack.length === 1) {
      return currentStack[0] === trueCode ||
      (currentStack[0] === falseCode ? false : {error: "returned a not boolean value: " + currentStack[0]});
    }

    if(notOperators.includes(currentStack[0])) {
      return this.resolveOperation(variablesMap[currentStack[1]], false, currentStack[0]);
    } else if(currentStack.length === 3) {
      return this.resolveOperation(variablesMap[currentStack[0]], variablesMap[currentStack[2]], currentStack[1]);
    }

    return {error: "The currentStack has something else", currentStack}
    //after for
  }

  calculateTruthTable() {
    let allCombinations = Math.pow(2, this.state.variables.length);
    let resultTable = [];
    for(var i = 0; i < allCombinations; i++) {
      let binaryString = i.toString(2);
      let length = binaryString.length;
      let variablesMap = {};
      let resultRow = [];
      this.state.variables.forEach((variable, index) => {
        let binaryPosition = length - 1 - index;
        let bool = binaryString[binaryPosition] === "1";
        variablesMap[variable] = bool;
        resultRow.push(bool);
      });
      let resolve = this.resolve(this.state.arrayValue, variablesMap);
      if (typeof resolve !== "boolean"){
        this.setState({truthyTable: resolve});
        return;
      }
      resultRow.push(resolve);
      //console.log(this.resolve(this.state.value, variablesMap), variablesMap);
      resultTable.push(resultRow)
    }
    this.setState({truthyTable: resultTable, savedHeader: this.state.value});
  }

  executeOperation() {
    RegExp.escape= function(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };


    let str = this.state.value;
    let str2 = this.state.value;
    reservedKeyWords.forEach((keyWord) => {
      let regexp = (new RegExp( RegExp.escape(keyWord), 'g'));
      str = str.replace(regexp, ' ');
      str2 = str2.replace(regexp, (x) => {
        return ` ${x} `;
      });
    });
    str = str.replace(/\s\s+/g, ' ');
    let variables = str.split(' ');//meterlo en un set para hacerlos unicos
    variables = variables.filter((el, i, ar) => {
      if(el === "") return false
      return ar.indexOf(el) === i;
    });

    str2 = str2.replace(/\s\s+/g, ' ');
    let arrayValue = str2.split(' ');


    this.setState({variables: variables, arrayValue: arrayValue}, this.calculateTruthTable);
  }

  render() {
    const styles = {

    }
    let table;
    if(this.state.truthyTable.length) {
      table =
      <table>
        <thead>
          <tr>
            {this.state.variables.map((x, i) => <th key={i}>{x}</th>)}
            <th key="last">{this.state.savedHeader}</th>
          </tr>
        </thead>
        <tbody>
          {
          this.state.truthyTable.map((row, j) => {
            return (
              <tr key={j}>
                {row.map((value, i) => <td key={i}>{value.toString()}</td>)}
              </tr>
            )
          })
          }
        </tbody>
      </table>
    } else if(this.state.truthyTable.error) {
      table = <span>{this.state.truthyTable.error}</span>
    } else {
      table = <span>Presione Ejecutar para ver el resultado en la tabla de verdad</span>
    }
    return (
    < div>
      < h1> Propositional Logic < /h1>
      {/*< input type="text" onChange={ this.setInputValue } value={ this.state.inputValue } />
      < button onClick={ this.addOption }> Agregar Variable < /button><br/>*/}

      < span value={ this.state.value }>
      < input type="text" onChange={ this.setValue } value={ this.state.value } />
      < select onChange={ this.setSelectedOperation } value={ this.state.selectedOperation }>
      {this.state.options.map((value, index) => {
        return <option key={ value }>
        {value}
        < /option>
      })}
      < /select>
      < button onClick={ this.addOperation }> Agregar al final < /button><br/>
      < button onClick={ this.executeOperation }> Ejecutar < /button>
      < /span>
      <div>
        {table}
      </div>
    < /div>
    )
  }
}

export default PropositionalLogic;
