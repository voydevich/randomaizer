Дано: Строки состоящие из произвольного количества букв английского алфавита
Нужно: 
- Реализовать алгоритм нормализующий строки таким образом, чтобы: 
- После каждой согласной буквы шла гласная - Если следующая буква не соотв. условию ( например гласная-гласная, согласная-согласная), то она должна быть перенесена в конец строки - Строки не должны заканчиваться на гласные буквы. Если строка заканчивается на гласную - она должна быть перенесена в начало следующей строки. 
- Реализовать Web based UI - Отобразить первоначальный ( случайный ) вариант 
- Реализовать элементы управления ( кнопки ) и сотов. им функции: 
- запуска алгоритма
 - возврат в исходное состояние 
 - возврат в случайное состояние
 - запись текущего состояния на сервер
 - загрузка ранее сохраненного состояния с сервера Условия: 
  Технологический стек: JavaScript, React, NodeJS