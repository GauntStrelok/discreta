import React, {
  Component
} from "react";

class PropositionalLogic extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   author: props.author,
    //   title: props.title
    // }
    this.addOption = this.addOption.bind(this);
    this.setInputValue = this.setInputValue.bind(this);
    this.setValue = this.setValue.bind(this);
    this.setSelectedOperation = this.setSelectedOperation.bind(this);
    this.addOperation = this.addOperation.bind(this);
    this.resolve = this.resolve.bind(this);
    this.resolveExpression = this.resolveExpression.bind(this);

  }


  state = {
    value: "",
    inputValue: "",
    variables: ["A", "B"],
    options: ["∧", "∨", "-", "→", "⇔", "A", "B"],
    selectedOperation: "∧"
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
      options.push(inputValue);
      variables.push(inputValue);
      inputValue = "";
    }
    //options.push("new");
    this.setState({
      inputValue: inputValue,
      variables: variables,
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
    console.log("llega"), bool1, bool2, operation;
    if (operation === "∧") {
      return bool1 && bool2;
    }

    if (operation === "∨") {
      return bool1 || bool2;
    }

    if (operation === "-") {
      return !bool1;
    }

    if (operation === "→") {
      return !bool1 || bool2;
    }

    if (operation === "⇔") {
      return (bool1 && bool2) || (!bool1 && !bool2);
    }
    return {error: "Hey there was an error with this operation"}
  }

  resolveExpression(evt) {
    console.log(1, this.resolve(this.state.value, {
      "A": true, "B": true
    }))
  }

  resolve(value, variablesMap) {
    variablesMap = {
      "A": true,
      "B": false
    }
    variablesMap.T = true;
    variablesMap.F = false;
    let trueValue = "T";
    let falseValue = "F";
    let pila = [];
    let currentStack = [];
    let parenthesisStack = [];
    let lastChar = "";
    let parenthesisCounter = 0;
    let isVariable = (c) => this.state.variables.includes(c)
    for (const c of value) {
      if (c === " ") continue;

      if (c === "(") {
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
      } else if (c === ")") {
        parenthesisCounter--;
        if (parenthesisCounter) {
          parenthesisStack.push(c);
          lastChar = c;
          continue;
        }
        //estamos en un caso extremo
        //en todo esto hay que revisar cosas como que lo anterior no sea tambien una variable por ejemplo
        let result = this.resolve(parenthesisStack, variablesMap);
        if (result !== true || result !== false) return result;
        currentStack.push(result ? "T" : "F");
        lastChar = result ? "T" : "F";
        continue;
      } else if (parenthesisCounter) {
        parenthesisStack.push(c);
        continue;
      } else if (lastChar === "-") {
        if (!isVariable(c))
          return {
            error: "The not operator should be used before an expression(between parenthesis) or a variable"
          };

        currentStack.push(c);
        pila.push(currentStack);
        currentStack = [];
        lastChar = "";
        continue;
      } else if (isVariable(c)) {
        if (lastChar) {
          if (isVariable(lastChar)) {
            return {
              error: "Cannot have variable after variable"
            };
          } else {
            currentStack.push(c);
            pila.push(currentStack);
            currentStack = [];
            lastChar = "";
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
          if(c === "-") {
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
    if(pila[0][0] === "-") {
      return this.resolveOperation(variablesMap[pila[0][1]], false, "-");
    }
    let bool1 = variablesMap[pila[0][0]];
    let bool2 = variablesMap[pila[0][2]];
    return this.resolveOperation(bool1, bool2, pila[0][1]);
    //after for
  }

  render() {
    const styles = {

    }
    return (
    < div>
      < h1> Propositional Logic < /h1>
      < input type="text" onChange={ this.setInputValue } value={ this.state.inputValue } />
      < button onClick={ this.addOption }> Agregar Variable < /button>
      < select onChange={ this.setSelectedOperation } value={ this.state.selectedOperation }>
        {this.state.options.map((value, index) => {
            return <option key={ value }>
                      {value}
                   < /option>
                 })}
      < /select>
      < button onClick={ this.addOperation }> Agregar < /button>
      < input type="text" onChange={ this.setValue } value={ this.state.value } />
      < span value={ this.state.value }>
      < button onClick={ this.resolveExpression }> Agregar < /button>
      < /span>
    < /div>
    )
  }
}

export default PropositionalLogic;
