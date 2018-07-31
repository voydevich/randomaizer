import React, {Component, Fragment} from 'react'
import ReactDOM from 'react-dom'
import fetch from 'isomorphic-fetch'
import "babel-polyfill";
import '../style/reset.scss'
import '../style/common.scss'

const vowels = ['', 'a', 'e', 'i', 'o', 'u', 'y'];


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popup: false,
            data: false,
            resultData: false,
            showData: false,
            textarea: ''
        };
        this.newData = this.newData.bind(this);
        this.changeTextarea = this.changeTextarea.bind(this);
        this.cancelTextarea = this.cancelTextarea.bind(this);
        this.submitTextarea = this.submitTextarea.bind(this);
        this.stringGenerator = this.stringGenerator.bind(this);
        this.DateToshowData = this.DateToshowData.bind(this);
        this.resultDataToshowData = this.resultDataToshowData.bind(this);
        this.sendToServer = this.sendToServer.bind(this);
        this.getFromServer = this.getFromServer.bind(this);
        this.stringTransform = this.stringTransform.bind(this);


    }


    newData(e) {
        const file = e.target.files[0];
        switch (file.type) {
            case 'text/plain': {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const result = e.target.result;
                    this.setState({
                        data: this.regexp(result),
                        showData: this.regexp(result),
                        resultData: false,
                    })
                };
                reader.readAsText(file);
                break;
            }
            case 'application/json': {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const result = JSON.parse(e.target.result);
                    if (result.data) {
                        this.setState({
                            data: this.regexp(result.data),
                            showData: this.regexp(result.data),
                            resultData: false,
                        })
                    }
                    else {
                        alert('Некорректный JSON');
                    }
                };
                reader.readAsText(file);
                break;
            }
            default : {
                alert('Неверный формат файла')
            }
        }
    }

    regexp(data) {
        const regexp = /[^-a-zA-Z\n]/gim;
        let result = data.replace(regexp, '').replace(/\n\n+/gi, '\n');
        return result.indexOf('\n') == 0 ? result.substring(1) : result;
    }

    changeTextarea(e) {
        this.setState({
            textarea: this.regexp(e.target.value)
        })
    }

    cancelTextarea() {
        this.setState({
            textarea: '',
            popup: false
        });
    }

    submitTextarea() {
        this.setState((prevState) => (
            {
                data: prevState.textarea,
                showData: prevState.textarea,
                resultData: false,
                textarea: '',
                popup: false
            }
        ));
    }

    stringGenerator() {
        let data = '';
        for (var i = 0; i < Math.round(Math.random() * 20) + 1; i++) {

            for (var s = 0; s < Math.round(Math.random() * 20) + 1; s++) {

                data += Math.random().toString(36).substr(2);
            }
            data += '\n'
        }

        this.setState({
            data: this.regexp(data),
            showData: this.regexp(data),
            resultData: false,
        })
    }

    DateToshowData() {
        this.setState((prevState) => (
            {
                showData: prevState.data
            }
        ))
    }

    resultDataToshowData() {
        this.setState((prevState) => (
            {
                showData: prevState.resultData
            }
        ))
    }

    sendToServer() {
        fetch('/api', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                data: this.state.data,
                resultData: this.state.resultData,
                showData: this.state.showData,
            })
        }).then(res => res.json()
            .then(res => {
                if (res.status == 'done') {
                    // alert("Данные сохранены")
                } else {
                    alert("Ошибка: " + res.status)
                }
            })
        );
    }


    getFromServer() {
        fetch('/api', {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        }).then(res => res.json()
            .then(res => {
                if (res.status == 'done') {
                    this.setState({
                        data: res.data.data,
                        resultData: res.data.resultData,
                        showData: res.data.showData,
                    });
                    // alert("Данные получены")
                } else {
                    alert("Ошибка: " + res.status)
                }
            })
        );
    }


    stopTransform(str) {
        let a = str.filter(value => {
            return vowels.indexOf(value) < 0 ? false : value
        });
        let b = str.filter(value => {
            return vowels.indexOf(value) > 0 ? false : value
        });
        return a.length < b.length ? a.length : b.length;
    }


    textTransform(str) {
        let before = [...str];
        let after = [];
        let swith = vowels.indexOf(str[0]) > 0 ? true : false;
        str.forEach((value, item) => {
            let letter = vowels.indexOf(value) > 0 ? true : false;
            before.splice(before.indexOf(value), 1);
            if (letter != swith) {
                before.push(value);
            }
            else {
                after.push(value);
                swith = !swith;
            }
        });
        after.push(...before);
        if (this.stopTransform(before) !== 0) {
            after = this.textTransform(after);
        }
        return after;
    }

    removeLast(str) {
        let r = [...str];
        let l = [];
        if (vowels.indexOf(r[r.length - 1]) > 0) {
            l.push(r.pop());
            let newRes = this.removeLast(r);
            l.push(...newRes.last)
            return {
                result: newRes.result,
                last: l
            }
        }
        else {
            return {
                result: r,
                last: l,
            }
        }
    }

    stringTransform() {
        const {data} = this.state;
        let arr = data.split('\n');
        arr.forEach((string, index) => {
            let arrStr = [...string];
            let transform = this.textTransform(arrStr);
            let noLast = this.removeLast(transform);
            arr[index] = noLast.result;

            if (noLast.last.length) {
                if (arr[index + 1]) {
                    arr[index + 1] = [...noLast.last, ...arr[index + 1]]
                }
                else {
                    arr[index + 1] = noLast.last;
                }
            }
        });

        let result = arr.map(strArr => {
            return strArr.toString().replace(/,/gi, '');
        });
        result = result.toString().replace(/,/gi, '\n');
        this.setState((prevState) => (
            {
                resultData: this.regexp(result),
                showData: this.regexp(result)
            }
        ))
    }

    render() {
        const {data, resultData, popup, textarea, showData} = this.state;
        return (
            <Fragment>
                <div className="container">
                    <div className="new-data">
                        <button className="btn" onClick={() => this.setState({popup: true})}>
                            Ввести данные
                        </button>

                        <label className="btn">
                            Загрузить данные с файла .txt или .json
                            <input type="file" accept=".txt, .json" className="hide" onChange={this.newData}/>
                        </label>

                        <button className="btn" onClick={this.stringGenerator}>
                            Сгенерировать данные
                        </button>
                    </div>
                    {!showData ? (
                        <div className="no-data">
                            Нет данных
                        </div>
                    ) : (
                        <div className="data">
                            {showData}
                        </div>
                    )}
                    <div className="controls">
                        <button className={!data ? "btn disabled" : "btn"} onClick={this.stringTransform}>
                            Запуска алгоритма
                        </button>
                        <button className={!resultData ? "btn disabled" : "btn"} onClick={this.resultDataToshowData}>
                            Возврат в исходное состояние
                        </button>
                        <button className={!data ? "btn disabled" : "btn"} onClick={this.DateToshowData}>
                            Возврат в случайное состояние
                        </button>
                        <button className={!showData ? "btn disabled" : "btn"} onClick={this.sendToServer}>
                            Запись текущего состояния на сервер
                        </button>
                        <button className="btn" onClick={this.getFromServer}>
                            Загрузка ранее сохраненного состояния с сервера
                        </button>
                    </div>
                </div>
                {!popup ? null : (
                    <div className="popup">
                        <div className="popup_mask" onClick={this.cancelTextarea}></div>
                        <div className="popup_content">
                            <textarea className="popup_area" value={textarea}
                                      onChange={this.changeTextarea}></textarea>
                            <div className="popup_flex">
                                <button className="btn cancel" onClick={this.cancelTextarea}>Отмена
                                </button>
                                <button className="btn" onClick={this.submitTextarea}>Ввести</button>
                            </div>
                        </div>
                    </div>
                )}
            </Fragment>
        )
    }
}

const root = document.querySelector('#index')
ReactDOM.render(<App/>, root)
