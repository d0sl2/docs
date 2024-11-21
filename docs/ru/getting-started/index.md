# Начало работы

## Пример

Hello world на d0sl:
```d0sl
signature DebugDSL is
	func logStr(a: string) -> logical abstract
end
semanticmodel asdf is
	use debug: DebugDSL from "com.gumirov.gav.DebugDSL"
	/*
	 * 
	 */
	predicate start() def
		debug.logStr("hello world!")
	end
end
```

!!! failure
    Данный раздел еще не готов :( Но в скором времени мы его дополним! 🥳
