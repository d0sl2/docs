# Начало работы

## Установка и настройка окружения (установка плагина)

1. Скачайте и установите eclipse [отсюда](https://www.eclipse.org/downloads/).

2. Нажмите `Help > Install new software`:  
![Help > Install new software](/docs/ru/assets/images/getting-started/install-plugin-01.png){ loading=lazy width="400" }

3. В открывшемся окне рядом со строкой с текстом "Work with:" или "Работать с:" нажмите add:  
![](/docs/ru/assets/images/getting-started/install-plugin-02.png){ loading=lazy width="400" }

4. В следующем окне введите в строке названия репозитория `D0SL Update site` или что-то подобное, а в строке с URL: `https://updatesite.d0sl.org/` и нажмите `Add`:  
![](/docs/ru/assets/images/getting-started/install-plugin-03.png){ loading=lazy width="400" }

5. Опционально: если вы участвуете в программе раннего тестирования, то используйте логин и пароль, предоставленный вам:  
![](/docs/ru/assets/images/getting-started/install-plugin-04.png){ loading=lazy width="400" }

6. Поставьте галочку около `D0SL Language` и нажмите `Next >`:  
![](/docs/ru/assets/images/getting-started/install-plugin-06.png){ loading=lazy width="400" }

	!!! note
		Если возникают сообщения с вопросом о доверии репозиторию, то нужно выбрать "всегда доверять"

7. Нажмите Finish:  
![](/docs/ru/assets/images/getting-started/install-plugin-07.png){ loading=lazy width="400" }

8. Нажмите `Restart eclipse`:  
![](/docs/ru/assets/images/getting-started/install-plugin-10.png){ loading=lazy width="400" }

## Первый проект

1. Установите плагин.

2. Нажмите `Window > Perspective > Open Perspective > Other` и выберите `D0SL`:  
![](/docs/ru/assets/images/getting-started/install-plugin-08.png){ loading=lazy width="400" }
![](/docs/ru/assets/images/getting-started/install-plugin-09.png){ loading=lazy width="400" }

3. После этого нажмите `File > New > Project` и в wizard выберите `General > Project`:  
![](/docs/ru/assets/images/getting-started/first-project-02.png){ loading=lazy width="400" }

	!!! note
		Во всплывающем окне `Convert to XText project?` может потребоваться нажать `Yes`
		![](/docs/ru/assets/images/getting-started/first-project-03.png){ loading=lazy width="400" }

4. После чего создайте в нем файл с любым названием и расширением `.d0sl` и введите в нем:
```d0sl
signature DebugDSL is
	func logStr(a: string) -> logical abstract
end

semanticmodel asdf is
	use debug: DebugDSL from "org.d0sl.stdlib.DebugDSL"

	predicate start() def
		debug.logStr("hello world!")
	end
end
```

5. Нажмите `Run > Run`. В консоли вы должны увидеть текст:  
![](/docs/ru/assets/images/getting-started/first-project-04.png){ loading=lazy width="400" }

!!! note
	Если вы его не увидели, то попробуйте перезапустить eclipse.

!!! note
	В запускаемом файле `d0sl` должна быть модель с предикатом `start` без аргументов. Если моделей в файле несколько, то может быть выбрана любая. (Как правило, последняя)

