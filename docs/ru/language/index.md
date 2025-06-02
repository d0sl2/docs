# Язык D0SL

## Основные сущности языка

В языке `d0sl` есть три основные сущности – **семантические модели, сигнатуры, а также их реализации – доменные модели**. 
В сигнатуре определяются типы объектов и объявляются доменные функции/предикаты. Эти типы и доменные функции затем 
могут быть использованы при задании правил в семантических моделях. Реализация сигнатур содержится в доменных моделей. 
Она находится в зоне ответственности профессиональных разработчиков. Доменные модели по сути являются драйверами (или библиотеками) 
для интеграции семантических моделей с окружающим миром, например такими как внешними СУБД, системами CRM, нейро-сетями, аппаратными датчиками и т.п. С технической точки зрения сигнатура является аналогом интерфейса (interface) в таких языках программирования, как 
C/C++, Golang или Java, а доменная модель является ее реализацией на конкретном языке программирования.  


!!! note
    **Семантическая модель (Semantic Model)** - объект, который определяется набором предикатов, функций и деклараций использования.  
    **Сигнатура (Signature)** - объект, который определяется набором **деклараций** предикатов, функций и деклараций типов.  
    **Доменная модель (Domain Model)** - реализация сигнатуры на некотором языке программирования.  

## Типы данных

В языке d0sl на данный момент существуют следующие встроенные типы данных:

 - `string` – произвольная строка.
 - `num` – число с плавающей точкой. (Внутри реализуется как `Double`)
 - `logical` – логическое значение [тернарной логики Клини](https://en.wikipedia.org/wiki/Three-valued_logic). (`true`, `false` или `unknown`)
 - `list<type>` – список значений любого типа, включая сам список.
 - Произвольные типы из сигнатур.

## Семантические модели

Начнем с определения основной сущности языка – семантической модели.

В языке она может быть определена следующим образом:
```d0sl
model <ModelName> is
    ...
end
```
или
```d0sl
semanticmodel <ModelName> is
    ...
end
```

Где вместо `<ModelName>` может быть любое имя.

!!! note
    В языке d0sl считается принятой конвенция наименования [`CamelCase`](https://en.wikipedia.org/wiki/Camel_case).

В теле модели могут содержаться предикаты, функции и декларации использования. (См далее)

Например:
```d0sl
model HelloWorld is
    use debug: DebugDSL from "org.d0sl.stdlib.DebugDSL"

    function getGreeting() -> string
        return "Hello world!"
    end

    predicate start() def
        debug.logStr(getGreeting());
    end
end
```

### Предикаты

Одной из составных частей модели являются предикаты. Предикаты позволяют вычислять логические выражения. Все строки предиката
берутся в конъюнкции, чтобы вычислить его итоговое значение.

В языке они определяются следующим образом:
```d0sl
predicate <predicateName>(<argument name>: <type>, ...) def
   ...
end
```

Где `<predicateName>` – произвольное имя предиката. `<argument name>` – имя одного из аргументов, `<type>` – его тип.  

Или, если предикат не определен явно (абстрактный) (такие конструкции могут использоваться только в сигнатурах):
```d0sl
predicate <predicateName>(<argument name>: <type>, ...) def abstract
```

В теле предиката могут содержаться декларации переменных и логические выражения. В любом порядке.

!!! warning
    Важно заметить, что по теоретическим соображениям присваивания в языке `d0sl` в явном виде запрещены.
    Можно только определять переменные, и потом ими оперировать. Значения переменных вычисляются лениво. 
    Т.е в данном примере переменная `a` не будет вычислена, а переменная `b` – будет:
    ```d0sl
    predicate some() def
        var a = "1234" + "5678";
        var b = "Hello world!";
        debug.logStr(b);
    end
    ```

Например:
```d0sl
predicate some() def
    var hello = "Hello";
    var world = "world!";
    debug.logStr(hello + " " + world);
end
```

### Функции

Еще одной немаловажной составной частью модели являются функции. Функции позволяют вычислить произвольное выражение от нескольких аргументов. Функции могут использовать другие доменные или семантические модели для этого.

В языке они определяются следующим образом:
```d0sl
func <functionName>(<argument name>: <type>, ...) -> <return type>
   var <var name> = <expression>;
   ...
   return <expression>
end
```
или
```d0sl
func <functionName>(<argument name>: <type>, ...) returns <return type>
   ...
end
```
или
```d0sl
function <functionName>(<argument name>: <type>, ...) returns <return type>
   ...
end
```

Или, если функция не определена явно (абстрактная) (такие конструкции могут использоваться только в сигнатурах):
```d0sl
func <functionName>(<argument name>: <type>, ...) -> <return type> abstract
```

!!! warning
    Важно, что абстрактные функции пока могут использоваться только в сигнатурах, не в моделях.

Где `<functionName>` – произвольное имя функции. `<argument name>` – имя одного из аргументов, `<type>` – его тип.
`<return type>` – тип выражения, которое функция возвращает.

В теле функции может содержаться произвольное количество определений переменных. Последней строкой в теле функции всегда
должно содержаться возвращаемое выражение.

Например:
```d0sl
func some() -> string
    var hello = "Hello";
    var world = "world!";

    return hello + " " + world;
end
```

!!! note
    После каждой строки в теле предиката или функции (кроме `return`) должна стоять точка с запятой `;`:  
    Верно ✅:
    ```d0sl
    predicate start() def
        <expression1>;
        <expression2>;
        <expression3>;
    end
    ```
    ```d0sl
    predicate start() def
        <expression1>;
        <expression2>;

        <expression3>;
    end
    ```
    ```d0sl
    predicate start() def
        <expression1>;
        <expression2>;
        
        // Comment:
        <expression3>;
    end
    ```
    
    Неверно ❌:
    ```d0sl
    predicate start() def
        <expression1>;

        <expression3>
    end
    ```
    ```d0sl
    predicate start() def
        <expression1>
        <expression2>;

        // Comment:
        <expression3>;
    end
    ```
    ```d0sl
    predicate start() def
        <expression1>;
        <expression2>
        <expression3>
    end
    ```

!!! note
    При этом в теле `if` или `exists`, `forall` точки с запятой не используются. Например:
    ```d0sl
    predicate start() def
        <expression1>;
        <expression2>;
        <expression3>;
        forall x in [1,2,3]: (
            x > 0
            and
            x < 4
        );

        if 1 == 2 then 
            true or
            false
        elif 2 == 2 then
            true or
            false
        else
            false
        end;
    end
    ```

    Если вы не хотите использовать `;`, то можно писать выражение предиката через `and` и переносы строки:
    ```d0sl 
    predicate start() def
        <expression1> and
        <expression2> and
        <expression3>;
    end

    // Эквивалентно:
    predicate start() def
        <expression1>;
        <expression2>;
        <expression3>;
    end
    ```

### Декларации использования (`use`)

Сферический язык в вакууме – бесполезен. Поэтому мы вводим понятие декларации использования, которое
аналогично понятию `import` или `#include` в других языках программирования. Данная конструкция позволяет
подключить и использовать доменные модели (с некоторой сигнатурой) или семантические модели. Таким образом,
модели могут взаимодействовать с внешним миром.

В языке такие конструкции определяются следующим образом:  

Для доменных моделей:
```d0sl
use <alias>: <Signature> from "<from string>"
```
или
```d0sl
use <alias> with signature <Signature> from "<from string>"
```

Для семантических моделей:
```d0sl
use <alias> @ <Model>
```
или
```d0sl
use <alias> with model <Model>
```

Здесь `<alias>` – короткое имя доменной модели или семантической модели, с помощью которого можно к ней обращаться
из функций и предикатов модели. `<Signature>` – имя сигнатуры, `<Model>` – имя семантической модели. `<from string>` – строка
определяющая реализацию сигнатуры (доменную модель).


`from`-строка может быть:

 - Fully qualified name класса на языке Java. (Например, классом `DebugDSL` из стандартной библиотеки `d0sl` – `"org.d0sl.stdlib.DebugDSL"`)
 - Адресом сервера, поддерживающего [RMS (Remote Model Server) протокол](...), например `"localhost:50051"`.

## Сигнатуры

Напомним, **cигнатура (Signature)** - объект, который определяется набором **деклараций** предикатов, функций и деклараций типов. 

Сигнатура в языке определяется следующим образом:
```d0sl
signature <Name> is
    <type def>*
    <abstract predicate def>*
    <abstract function def>*
end
```
или 
```d0sl
sign <Name> is
    <type def>*
    <abstract predicate def>*
    <abstract function def>*
end
```

Где `<type def>*` произовльное количество деклараций типов, `<abstract predicate def>*` и `<abstract function def>*` – произвольное количество деклараций абстрактных функций и предикатов вида:

```d0sl
predicate <predicateName>(<argument name>: <type>, ...) def abstract
```
и
```d0sl
func <functionName>(<argument name>: <type>, ...) -> <return type> abstract
```

### Декларация типа

Декларация типа позволяет определить тип, который может быть использован в рамках **одной** сигнатуры (и доменной модели),
что позволяет оперировать в языке произвольными объектами.

!!! warning
    Важно, что произвольные типы пока не поддерживаются RMS протоколом.

В языке определяется следующим образом:
```d0sl
type <Type name> def end
```

Где `<Type name>` – имя типа. Все детали реализации этого типа "спрятаны" в доменной модели.

В предикатах и функциях к ним можно обращаться так по имени сигнатуры и имени типа:
```d0sl
signature Test is
    type ABC def end

    func getABC() -> ABC abstract
    func toString(abc: ABC) -> string abstract
end

model TestModel is
    use test: Test from "..."

    predicate isEmpty(abc: Test.ABC) def
        test.toString(abc) != "";
    end

    predicate start() def
        var a = test.getABC();
        isEmpty(a);
    end
end
```

## Выражения

Любое выражение в скобках – выражение. I.e `(<expression>)` 

### Логические выражения

Базовыми логическими выражениями являются логические константы `true`, `false` и `unknown`. А так же вызовы предикатов и логических функций.  

Остальные логические выражения могут строиться из:

 - "И" – `<logical expression> and <logical expression>`
 - "ИЛИ" – `<logical expression> or <logical expression>`
 - "НЕ" – `!(<logical expression>)`
 - Сравнения – `<any expression> <comparison operator> <any expression>` (`comparison operator` = `<=`, `<`, `>`, `>=`, `==`, `!=`, где первые четыре сравнения только для чисел, а `==` и `!=` для любых типов)
 - Квантор всеобщности ("Для всех") – `forall <var>, <var2>, ... in <list expression>: <logical expression>` (где `<varN>` – набор значений из списка `<list expression>`, `<logical expression>` – выражение, которое должно быть истинно для всех наборов `<varN>` из списка. При вычислении при получении первого значения `false` останавливается)
 - Квантор существования ("Существует") – `exists <var>, <var2>, ... in <list expression>: <logical expression>` (где `<varN>` – набор значений из списка `<list expression>`, `<logical expression>` – выражение, которое должно быть истинно хотя бы для одного набора `<varN>` из списка. При вычислении при получении первого значения `true` останавливается)
 - "Если, то, иначе":
   ```d0sl
   if <logical expression> then
      <logical expression>
   end
   ```
   или
   ```d0sl
   if <logical expression> then
      <logical expression>
   else
      <logical expression>
   end
   ```
   или
   ```d0sl
   if <logical expression> then
      <logical expression>
   elif <logical expression> then
      <logical expression>
   else
      <logical expression>
   end
   ```
   Работает так же, как и в других языках программирования.

### Численные выражения

 - "Плюс" – `<num> + <num>`
 - "Минус" – `<num> - <num>` или `-<num>`
 - "Деление и умножение" – `<num> / <num>` и `<num> * <num>`

### Строковые выражения

 - "Конкатенация строк" – `<string> + <string>`, `<any> + <string>` и `<string> + <any>`.

При конкатенации строк с произвольным типом из сигнатуры поведение преобразования этого типа в строку определяется реализацией конкретной доменной модели.

!!! note
    При конкатенации строк с произвольным типом из сигнатуры поведение преобразования этого типа в строку определяется реализацией конкретной доменной модели.

    Например, в Java это определяется методом `toString`. Подробнее это описано в разделе про доменные модели.

### Другие выражения

#### Условный терм (тернарный оператор)

Для любых выражений работает "тернарный" оператор. (условный терм):  
`?(<logical expression> ? <true expression> : <false expression>)` – возвращает значение `<true expression>`, если `<logical expression> = true`, и `<false expression>`, если `<logical expression> = false или unknown`.  

Есть также его расширенная версия `?(<logical expression> ? <true expression> : <false expression> : <unknown expression>)`, которая возвращает значение `<unknown expression>`, если значение `<logical expression> = unknown`.

#### Списочные выражения

Списочные выражения: `[<expression>, <expression>, ...]`. Такие выражения можно использовать в кванторах. 
