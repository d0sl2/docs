# Доменные модели

Для взаимодействия с внешним миром d0sl может использовать два типа доменных моделей:

 - Нативные доменные модели – реализуются на Java и запускаются в одном адресном пространстве с ядром языка d0sl.
 - Удаленные доменные модели – взаимодействуют с ядром во время исполнения посредством протокола RMS, который реализован на основе gRPC и на уровне транспорта может работать посредством UNIX-сокетов или TCP. Такие модели могут реализовывать на любом языке программирования и физически даже могут исполняться на другом устройстве.

Выбор того или иного способа реализации выбирается самим разработчиком доменной модели в зависимости от решаемой задачи.

## Удаленные доменные модели на python

!!! warning
    Доменные модели на python пока не поддерживают не встроенные типы. То есть, поддерживаются `logical`, `string`, `numeric`, `list<*>`, `list<list<*>>` и т.д.

Для реализации доменных моделей на python используется библиотека [`pyrdms`](https://pypi.org/project/pyrdms/), которая отвечает за взаимодействие с ядром по RMS.

Для подключения удаленных доменных моделей можно использовать инструкции use следующего вида:
```d0sl
use <model>: <Signature> from "<host>:<port>"
```

Из python можно публиковать объекты любых классов.

```python
from pyrdms import predicate, serve

class NonDecoratedDSL:
    def __init__(self):
        pass

    def a_plus_b_plus_c_plus_d(self, a: int, b: int, c: int, d: int) -> int:
        return a + b + c + d

serve(50051, NonDecoratedDSL=NonDecoratedDSL())
```

Для этого создается экземпляр класса с имененм, соответствующим имени сигнатуры в d0sl, и передается как ключевой аргумент в `serve`. Первым аргументом serve является порт, на котором будет запущен RMS-сервер.

Важно, что все методы должны иметь декларации типов, иначе pyrdms не сможет проверить совместимость сигнатур. 

Если необходимо опубликовать только часть методов, то такие методы можно пометить с помощью декоратора `@predicate`:

```python
from pyrdms import predicate, serve

class DecoratedClass:
    def __init__(self):
        pass
    
    @predicate
    def some_method(self, a: int, b: bool, c: str, d: list) -> bool:
        return True
    
    def some_other_method(self, a: int, b: bool, c: str, d: list) -> bool:
        return True

serve(50051, DecoratedClass=DecoratedClass())
```

В d0sl удаленные доменные модели используются аналогично нативным:
```d0sl
sign Remote is
    func some_method(a: num, b: logical, c: string, d: list<string>) -> logical abstract
end

model Test is
    use remote: Remote from "localhost:50051"
    
    predicate start() def
        remote.some_method(1, true, "", ["123"]);
    end 
end
```
