# parsing strings with functions
## i like functions

-----

## javascript function syntax

```
const my_fun = x => x + 1
const my_fun = x => {
	return x + 1
}
const my_fun = function(x) {
	return x + 1
}
function my_fun(x) {
	return x + 1
}
```

all of these are same thing for our purposes!!

-----

# what is: function??

what does function mean to you??

-----

## function as mapping

function is a lot of thing to many different people.

but what if it is just mapping from one type to another?

```
int -> string
string -> int
...
```

very abstract!!

-----

## i like abstraction

what would these functions likely be then??

```
const len = str => str.length
const num = n => 'haha this is my number ' + n
```

-----

`len` probably `string -> int`

`num` probably `int -> string` or actually more like `number -> string` because at high level javascript doesnt distinguish int from just number i think

(so `len` actually technically more like `string -> number`)

```
// string -> number
const len = str => str.length

// number -> string
const num = n => 'haha this is my number ' + n
```

-----

## i like functions

```
// number -> number
const incremented = x => x + 1

// number, number -> number
const add = (x, y) => x + y

// number, string -> string
const repeat = (x, str) => str.repeat(x)
```

-----

## returning a function

what if we want to return a function from a function?? like `string -> (string -> string)`, a function that takes string and returns a function `string -> string`??

```
const greet = greeting => name => greeting + ', ' + name

const greet = function(name) {
	return function(greeting) {
		return greeting + ', ' + name
	}
}
```
oh, we could!! note: above two are the same

-----

### greeting

now we can make specific greeting functions.. how convenient!!

```
const greet = greeting => name => greeting + ', ' + name

const hello = greet('hello')
const bye   = greet('bye')

console.log(hello('world')) // hello, world
console.log(bye('world'))   // bye, world
```

note: `hello('world')` you could also just do `greet('hello')('world')` without having to make intermediate function. but assuming that you want to define an intermediate function for some reason!!

-----

## another example: function composition

do you know function composition?? if you have function `A -> B`, and function `B -> C`, you could smush the two together to make `A -> C`??

```
A -> B, B -> C

A -> B -> C

A -> C
```

lets make this.. lets make an 'after' function which will take two functions, and return new function that is same as applying the first one after the second.

```
// (b -> c), (a -> b) -> a -> c
const after = (f, g) => (...args) => f(g(...args))
```

see.. f is `B -> C`, g is `A -> B`, `...args` is an `A`. so `g(...args)` is a `B`, and thus `f(g(...args))` is a `C`!! oh, so cool!

-----
### wow epic bro
```
// (b -> c), (a -> b) -> a -> c
const after = (f, g) => (...args) => f(g(...args))

// string -> number
const len = str => str.length

// number -> string
const num = n => 'haha this is my number ' + n

// string -> string
const how_long = after(num, len) // num after len

console.log(how_long('hello')) // "haha this is my number 5"
```

wow cool bro, we made a `string -> string` out of `number -> string` after `string -> number`

-----
# review
functions

i like functions

-----
# use functions
but, why use these techniques like functions that take functions and return functions??

seem very convoluted?? what is good use??

lets use functions now!!!! :)

-----
# introduction to problem:

## parsing stuff

-----

## i want to turn string into 'parse tree'

we have string `"1+2+(4-5)*6"`
we would like to turn it into something we can 'easily evaluate' like a tree.

```
  +
 / \
1   +
   / \          we must turn that string
  2   *         into this with programming!!
     / \
    -   6
   / \
  4   5
```
-----

## our tree representation

for our purposes let us represent this tree with a javascript list like this

```
  +
 / \
1   +
   / \          ['+', 1, ['+', 2, ['*', ['-', 4, 5], 6]]]
  2   *         each thing is [operator, left, right]
     / \
    -   6
   / \
  4   5
```

-----

## hand-evaluating tree for reminder

```
  +   ======>   +   ======>   +   ======>   +   ======> -3
 / \           / \           / \           / \
1   +         1   +         1   +         1  -4
   / \           / \           / \
  2   *         2   *         2  -6
     / \           / \
    -   6        -1   6
   / \
  4   5
```

```
['+', 1, ['+', 2, ['*', ['-', 4, 5], 6]]]
['+', 1, ['+', 2, ['*', -1, 6]]]
['+', 1, ['+', 2, -6]]
['+', 1, -4]
-3
```

-----
## tree recursion evaluation reminder

```
const evaluate = tree => {
	if (typeof(tree) === 'number') return tree

	const [operator, left, right] = tree

	const x = evaluate(left)
	const y = evaluate(right)

	if (operator === '+') return x + y
	if (operator === '-') return x - y
	if (operator === '*') return x * y
	if (operator === '/') return x / y
}

// prints "-3"
console.log(evaluate(['+', 1, ['+', 2, ['*', ['-', 4, 5], 6]]]))
```

-----
## array destructuring

```
const array = ['hello', 'world']

// the following are same
const [a, b] = array

const a = array[0]
const b = array[1]
```

-----
# begin solving problem:

## parse a small thing

-----

how turn `"1+2+(4-5)*6"` into `['+', 1, ['+', 2, ['*', ['-', 4, 5], 6]]]`???

great question!!

first, let us just parse a small thing then generalise from there!!

-----

## parse '1'

let us parse the single character '1' from a string. so we want a function that maps like this

```
'1'   -> 1
'11'  -> 1 // we are just parsing single character innit
'abc' -> error?? no parse??
''    -> also error?
```

how do we handle when we could not parse a '1' from the string??

-----

## choose peace, not error

well let us actually just return something in addition that says whether we succeeded parsing or not!!

```
'1'   -> { value: 1, failed: false }
'11'  -> { value: 1, failed: false }
'abc' -> { value: null, failed: true }
''    -> { value: null, failed: true }
```

for convenience no clutter, let us omit implied values like this:

```
'1'   -> { value: 1 }
'11'  -> { value: 1 }
'abc' -> { failed: true }
''    -> { failed: true }
```

actually, conveniently, `null`, `false`, and `undefined` are all 'falsy' values, so if you try to get `failed` from `{ value: 1 }`, it will return `undefined` which still evaluates to `false`!!

-----

## so what is the 'type' of a parser?

so a parser is just a function that maps a `string` (the string to be parsed) to a parser result.. and that parser result is a javascript object with fields `value` (in this case an `int`/`number`) and `failed` (a `boolean`)

in shorter notation, we could represent it somehow like this

```
Parser int: string -> { value: int, failed: boolean }
```

and more generally,

```
Parser a: string -> { value: a, failed: boolean }
```

-----

# writing the 1 parser

now we just have to write a function that does this mapping!!

```
// Parser int
const parse_1 = str =>
	str[0] === '1'
		? { value: 1 }
		: { failed: true }

console.log(parse_1('1'))   // { value: 1 }
console.log(parse_1('11'))  // { value: 1 }
console.log(parse_1('abc')) // { failed: true }
console.log(parse_1(''))    // { failed: true }
```
-----
## ternary operator

often in programming languages with c-like syntax

```
const condition = true

// the two following are same basically
const result = condition ? 'yes it was true' : 'no it was false'

let result = null
if (condition) result = 'yes it was true'
else           result = 'no it was false'

// i prefer type the first one like this
const result = condition
	? 'yes it was true'
	: 'no it was false'
```
-----
## now we have a parser that can extract 1 from a string :)

```
// Parser int
const parse_1 = str =>
	str[0] === '1'
		? { value: 1 }
		: { failed: true }

console.log(parse_1('1'))   // { value: 1 }
```

but then we could generalise this by making a function that makes a parser for any character we want!!

```
// char -> Parser char
const parse_char = char => str =>
	str[0] === char
		? { value: char }
		: { failed: true }

// Parser char
const parse_z = parse_char('z')

console.log(parse_z('zzz'))   // { value: 'z' }
```

-----

## now we can make any character parser we want :)

```
// char -> Parser char
const parse_char = char => str =>
	str[0] === char
		? { value: char }
		: { failed: true }
```

but actually, javascript makes it very easy to generalise this even more into a whole string parser!!! (char in javascript is just 1-length string anyways i think)

```
// string -> Parser string
const parse_str = str_toParse => str =>
	str.startsWith(str_toParse)
		? { value: str_toParse }
		: { failed: true }

// Parser string
const parse_abc = parse_str('abc')

console.log(parse_abc('abcdef'))   // { value: 'abc' }
```

-----

# next up: parsing this _or_ that
## combining a smaller parser into a more complex parser

-----

now we can parse any character or string that we can want. that is great!!

we can start parsing number characters.. like '0', or '1', or '2'.

```
const parse_0 = parse_str('0')
const parse_1 = parse_str('1')
const parse_2 = parse_str('2')

console.log(parse_0('123')) // { failed: true }
console.log(parse_1('123')) // { value: '1'   } note: '1', not 1
console.log(parse_2('123')) // { failed: true }
```
but now the problem is we can only parse out specific digits.. we want to parse out _any_ digit!! like this:

```
console.log(parse_digit('123')) // { value: '1' }
console.log(parse_digit('456')) // { value: '4' }
```

wow, it would be nice..

-----

## parsing this or that: i love functions

well let us just make a function that combines two parsers into one with this functionality!!

the type would be like

```
Parser a, Parser b -> Parser (a or b)
```

yes i think `Parser (a or b)` is kinda weird.. we could iron this out but lets just move on for now.. anyways we will probably just be combining parsers of same type, so it will probably mostly be `Parser a, Parser a -> Parser a

-----

## parsing this or that: writing the function `or`

now we can write such a function.. let us call it `or` because it like parses using the first _or_ the second parser innit..

```
// Parser a, Parser b -> Parser (a or b)
const or = (first, second) => str => {
	const result = first(str)
	if (!result.failed) return result
	return second(str)
}

const parse_this_or_that = or(parse_str('this'), parse_str('that'))
console.log(parse_this_or_that('this is that')) // { value: 'this' }
console.log(parse_this_or_that('that is this')) // { value: 'that' }
```

very interesting..

-----

## notes

all of the following achieve same thing and are `Parser a, Parser b -> Parser (a or b)`

```
<span class=small>// the original code
// Parser a, Parser b -> str -> result with a or b
// which is same as Parser a, Parser b -> Parser (a or b)
const or = (first, second) => str => {
	const result = first(str)
	if (!result.failed) return result
	return second(str)
}

// syntax better illustrates 'taking two parsers and returning new one'
const or = (first, second) => {
	return str => {
		const result = first(str)
		if (!result.failed) return result
		return second(str)
	}
}

// instead of just defaulting to second parser, go through both
const or = (first, second) => str => {
	const result = first(str)
	if (!result.failed) return result

	const result2 = second(str)
	if (!result2.failed) return result2

	return { failed: true }
}</span>
```

-----

## now we could parse any digit..

now that we can parse different things with same parser, we could do like

```
const parse_digit = or(parse_str('0'), or(parse_str('1'), or(parse_str('2'), or(parse_str('3'), or(...)))))
```

but actually, that is same as this:

```
const parse_digit = ['0', '1', '2', '3', ...].map(parse_str).reduce(or)
```

which is same as

```
const parse_digit = '0123456789'.split('').map(parse_str).reduce(or)
```

```
// Parser str
// or `Parser char` if you consider 1-length string a char
const parse_digit = '0123456789'.split('').map(parse_str).reduce(or)

console.log(parse_digit('123')) // { value: '1' }
console.log(parse_digit('456')) // { value: '4' }
```

-----

### aside: map and reduce

`map` applies a function to all elements, `[a].map(a -> b): [b]`

example of map where `a = string`, `b = int`.
```
// [string].map(string -> int): [int]
['hello', 'world!!'].map(str => str.length) // [5, 7]
```

`reduce` 'folds' down an array from left to right, `[a].reduce((b, a) -> b, b): b`

example of reduce where `a = string`, `b = int`. it produces sum of length of all strings in array. (better illustration on next slide)
```
// [string].reduce((int, string) -> int, int): int
['hello', 'world!!'].reduce((sum, str) => sum + str.length, 0) // 12
```

a commonly used situation is when `a = b`, so it is `[a].reduce((a, a) -> a, a)`.

in this case you could do `ar.slice(1).reduce((a, a) -> a, ar[0])`, which in javascript you can do with just `ar.reduce((a, a) -> a)`. note that this doesnt work if `ar` is ever empty, since `ar[0]` is undefined

```
// [int].reduce((int, int) -> int)
[1, 2, 3].reduce((x, y) => x + y) // 6
```

-----

### illustration of reduce

```
// ['hello', 'world!!'].reduce((sum, str) => sum + str.length, 0)
0  ['hello', 'world!!'] // 0 + 'hello'.length   = 0 + 5 = 5
5  ['world!!']          // 5 + 'world!!'.length = 5 + 7 = 12
12 []                   // done, returns 12
```

```
// [1, 2, 3].reduce((x, y) => x + y)
1  [2, 3] // 1 + 2 = 3
3  [3]    // 3 + 3 = 6
6  []     // done, returns 6
```

```
// [].reduce((x, y) => x + y)
??? [] // oops doesnt work!! explosion
```

```
// [1].reduce((x, y) => x + y)
1  [] // done, returns 1
```

```
// [].reduce((x, y) => x + y, 0)
0  [] // done, returns 0
```

-----

# what have so far

```
// Parser a, Parser b -> Parser (a or b)
const or = (first, second) => str => {
	const result = first(str)
	if (!result.failed) return result
	return second(str)
}

// string -> Parser string
const parse_str = str_toParse => str => str.startsWith(str_toParse)
	? { value: str_toParse }
	: { failed: true }

// Parser str
const parse_digit = '0123456789'.split('').map(parse_str).reduce(or)

// Parser str
<span class=highlight-code>const parse_number = parse_digit</span>
```

cool, now we can parse any single digit!!

we might want to parse multiple digit number like `123+456`. for now, will not do that; will cover at end! for now, let us say that a number is just one digit like on the highlighted line `const parse_number = parse_digit`.

-----

# next: parsing a first expression
## like `1+1`

-----

now we can parse single digit number. now we want to parse a bigger expression!! like `1+1` or `1+2`. cool!! let us first start with an expression like `num+num` and then refine it from there, moving onto `num+num+num`, then other operators like `-`, then `*` and `/` with order of operations.

to start out, let us make a parser that produces following mapping

```
'1+1' => { value: ['+', 1, 1] }
'1+2' => { value: ['+', 1, 2] }
'1+'  => { failed: true }
```

-----

## parsing `1+1`

how would we parse `num+num`?? well we can parse a number because we have `parse_number` (which for now is just `parse_digit`). and we can make a plus-sign parser with `parse_str('+')`. so all we need is to consecutively parse out what we want from the string!!

```
const parse_plus_expr = str => {
	parse out first number..                fail if this fails
	parse out plus sign from the rest..     fail if this fails
	parse out second number from the rest.. fail if this fails
	return ['+', first number, second number]
}
```

the only problem is.. how do we get the rest of string after parsing out something??

since for now, everything is only one character, we could just hard code the values in :)) but that will not scale at all!! so actually we need each parser to return the rest of the string when it successfully parses something out.

-----

## returning rest

luckily returning rest of string is actually not that big of a change in our existing code!! it only changes one line

```
// Parser a, Parser b -> Parser (a or b)
const or = (first, second) => str => {
	const result = first(str)
	if (!result.failed) return result
	return second(str)
}

// string -> Parser string
const parse_str = str_toParse => str => str.startsWith(str_toParse)
<span class=highlight-code>	? { value: str_toParse, rest: str.slice(str_toParse.length) }</span>
	: { failed: true }

// Parser str
const parse_digit = '0123456789'.split('').map(parse_str).reduce(or)

// Parser str
const parse_number = parse_digit

console.log(parse_number('1+2'))         // { value: '1', rest: '+2' }
console.log(parse_str('abc')('abcdefg')) // { value: 'abc', rest: 'defg' }
```

-----

## writing plus-expression parser

let us translate pseudocode now!!
```
<span class=small>const parse_plus_expr = str => {
	parse out first number..                fail if this fails
	parse out plus sign from the rest..     fail if this fails
	parse out second number from the rest.. fail if this fails
	return ['+', first number, second number]
}</span>
```

```
// Parser tree
const parse_plus_expr = str => {
	const first_num = parse_number(str)
	if (first_num.failed) return { failed: true }

	const plus_sign = parse_str('+')(first_num.rest)
	if (plus_sign.failed) return { failed: true }

	const second_num = parse_number(plus_sign.rest)
	if (second_num.failed) return { failed: true }

	return { value: ['+', parseInt(first_num.value), parseInt(second_num.value)]
	       , rest: second_num.rest
	       }
}

console.log(parse_plus_expr('1+1'))    // { value: ['+', 1, 1], rest: '' }
console.log(parse_plus_expr('1+2abc')) // { value: ['+', 1, 2], rest: 'abc' }
console.log(parse_plus_expr('1+'))     // { failed: true }
```

wow epic bro

-----

## epic..but is it really??

```
<span class=small>const parse_plus_expr = str => {
	const first_num = parse_number(str)
	if (first_num.failed) return { failed: true }

	const plus_sign = parse_str('+')(first_num.rest)
	if (plus_sign.failed) return { failed: true }

	const second_num = parse_number(plus_sign.rest)
	if (second_num.failed) return { failed: true }

	return { value: ['+', parseInt(first_num.value), parseInt(second_num.value)]
	       , rest: second_num.rest
	       }
}</span>
```

this code is very repetitive bro.. not epic!! it is very tedious and very prone to error if we continue to extend it like this, i think.

manually typing out all the early returns, piping the previous `.rest` into the next, etc. not epic!!

how could we improve this??

-----

## functions?? i love functions bro

one hundred years of computer science theory has evolved to allow you to write your program without repetitive boilerplate code

yes that's right!! you could use functions to solve this problem.

here is the concept: make a function that takes a parser, a function that makes a new parser based on the output of the old one, and returns a parser that pipes everything together, running its input through the old parser (and failing if old fails), making the new parser, and returning output of the new parser!!

wow epic!!! actually, this is shorter in code than in words i think. lets call the cool function `bind` because it like binds the old parser to the new one with some cool glue

```
// Parser a, (a -> Parser b) -> Parser b
const bind = (old, make_new) => str => {
	const out = old(str)
	return out.failed
		? { failed: true }
		: make_new(out.value)(out.rest)
}
```

-----

## let us bind

```
<span class=small>const parse_plus_expr = str => {
	const first_num = parse_number(str)
	if (first_num.failed) return { failed: true }

	const plus_sign = parse_str('+')(first_num.rest)
	if (plus_sign.failed) return { failed: true }

	const second_num = parse_number(plus_sign.rest)
	if (second_num.failed) return { failed: true }

	return { value: ['+', parseInt(first_num.value), parseInt(second_num.value)]
	       , rest: second_num.rest
	       }
}</span>
```

```
const parse_plus_expr = bind
	( parse_number
	, first_num => bind
		( parse_str('+')
		, plus_sign => bind
			( parse_number
			, second_num => str => ({ rest: str, value: ['+', parseInt(first_num), parseInt(second_num)] })
			)
		)
	)
```

wow bro how epic! we do not have to manually handle failure, or rest, or unpacking values. wow epic!

-----

## retoorn
```
<span class=small>const parse_plus_expr = bind
	( parse_number
	, first_num => bind
		( parse_str('+')
		, plus_sign => bind
			( parse_number
<span class=highlight-code>			, second_num => str => ({ rest: str, value: ['+', parseInt(first_num), parseInt(second_num)] })</span>
			)
		)
	)</span>
```

ok 1 thing to note is this line!! we need to return our tree, but `bind` takes an `a -> Parser b` as its second argument. so we just give it a `Parser tree` that unconditionally returns the tree we want.

we can clean this up a bit by separating that out to a function :)

```
<span class=small>// a => Parser a
// returns a parser that unconditionally yields your `a`
const retoorn = val => str => ({ rest: str, value: val })

// Parser tree
const parse_plus_expr = bind
	( parse_number
	, first_num => bind
		( parse_str('+')
		, plus_sign => bind
			( parse_number
			, second_num => retoorn(['+', parseInt(first_num), parseInt(second_num)])
			)
		)
	)</span>
```

haha epic:)

-----

# what do we have so far

```
<span class=small>// Parser a, (a -> Parser b) -> Parser b
const bind = (old, make_new) => str => {
	const out = old(str)
	return out.failed
		? { failed: true }
		: make_new(out.value)(out.rest)
}

// a => Parser a
const retoorn = val => str => ({ rest: str, value: val })

// Parser a, Parser b -> Parser (a or b)
const or = (first, second) => str => {
	const result = first(str)
	if (!result.failed) return result
	return second(str)
}

// string -> Parser string
const parse_str = str_toParse => str => str.startsWith(str_toParse)
	? { value: str_toParse, rest: str.slice(str_toParse.length) }
	: { failed: true }

// Parser str
const parse_digit = '0123456789'.split('').map(parse_str).reduce(or)

// Parser str
const parse_number = parse_digit

// Parser tree
const parse_plus_expr = bind
	( parse_number
	, first_num => bind
		( parse_str('+')
		, plus_sign => bind
			( parse_number
			, second_num => retoorn(['+', parseInt(first_num), parseInt(second_num)])
			)
		)
	)</span>
```

opps!!! our program has grown.. it cannot even fit comfortably on a single page..

there is one last tweak i would like to make now before we move on.. we are manually `parseInt`ing the numbers we parse out.. because `parse_num` is a `Parser string`, not `Parser int`. let us quickly patch it up with our new friend `bind` and `retoorn` :))

-----
```
<span class=small>// Parser a, (a -> Parser b) -> Parser b
const bind = (old, make_new) => str => {
	const out = old(str)
	return out.failed
		? { failed: true }
		: make_new(out.value)(out.rest)
}

// a => Parser a
const retoorn = val => str => ({ rest: str, value: val })

// Parser a, Parser b -> Parser (a or b)
const or = (first, second) => str => {
	const result = first(str)
	if (!result.failed) return result
	return second(str)
}

// string -> Parser string
const parse_str = str_toParse => str => str.startsWith(str_toParse)
	? { value: str_toParse, rest: str.slice(str_toParse.length) }
	: { failed: true }

// Parser str
const parse_digit = '0123456789'.split('').map(parse_str).reduce(or)

<span class=highlight-code>// Parser int
const parse_number = bind(parse_digit, digit => retoorn(parseInt(digit)))</span>

// Parser tree
const parse_plus_expr = bind
	( parse_number
	, first_num => bind
		( parse_str('+')
		, plus_sign => bind
			( parse_number
<span class=highlight-code>			, second_num => retoorn(['+', first_num, second_num])</span>
			)
		)
	)</span>
```

great thats perfect bro :))

-----

# writing literally everything else

## wow cool, bro

-----

wow cool bro, actually we are almost all done, only like 3 things left:

<ol>
<li>`1+2+3+4+...`</li>
<li>subtraction</li>
<li>multiplication/division, and order of operations</li>
<li>parens</li>
<li>multiple digit numbers?</li>
</ol>

-----

## 1. `1+2+3+...`

oh, actually we can change one line to correctly parse this :)

```
const parse_plus_expr = bind
	( parse_number
	, first_num => bind
		( parse_str('+')
		, plus_sign => bind
<span class=highlight-code>			( or(parse_plus_expr, parse_number)</span>
			, second_num => retoorn(['+', first_num, second_num])
			)
		)
	)

// omg!!!
console.log(parse_plus_expr('1+2+3+4')) // { value: ['+', 1, ['+', 2, ['+', 3, 4]]], rest: '' }
```

oh,wow thats so epic bro!:) instead of right side is just another number, it could be another plus expression!!!!!! wow.. now the names `first_num` and `second_num` could better be expressed `left` and `right` i think

```
<span class=small>const parse_plus_expr = bind
	( parse_number
	, left => bind
		( parse_str('+')
		, plus_sign => bind
			( or(parse_plus_expr, parse_number)
			, right => retoorn(['+', left, right])
			)
		)
	)</span>
```

-----

## 2. `1-2+3`

since subtraction is same order of operations as addition, we can just slap minus in with our plus expression!!

```
const parse_plus_expr = bind
	( parse_number
	, left => bind
<span class=highlight-code>		( or(parse_str('+'), parse_str('-'))
		, sign => bind</span>
			( or(parse_plus_expr, parse_number)
<span class=highlight-code>			, right => retoorn([sign, left, right])</span>
			)
		)
	)

console.log(parse_plus_expr('1-2-3+4')) // { value: ['-', 1, ['-', 2, ['+', 3, 4]]], rest: '' }
```

omg!! could you believe that?

there are other ways u could approach this feature addition.. this is just one way that minimally modifies current code..

-----

## 3. multiplicación y división

¿cómo hacer la multiplicación y división con orden de evaluación??? hmm.. es similar a la adición y sustracción, ¿no¿¿? pero a la derecha de la expresión sólo puede ser una expresión de multiplicación o división, o un número.

vamos a hacer un parser de expresión de times!!

```
// Parser tree
const parse_times_expr = bind
	( parse_number
	, left => bind
		( or(parse_str('*'), parse_str('/'))
		, sign => bind
			( or(parse_times_expr, parse_number)
			, right => retoorn([sign, left, right])
			)
		)
	)
```

¡¡tan similares son expresión de plus y expresión de times, ¿¿no?!!!

-----

## 3.2 plus y times

¡¡pero ya es necesario modificar parser de plus!!

```
const parse_times_expr = bind
	( parse_number
	, left => bind
		( or(parse_str('*'), parse_str('/'))
		, sign => bind
			( or(parse_times_expr, parse_number)
			, right => retoorn([sign, left, right])
			)
		)
	)
const parse_plus_expr = bind
<span class=highlight-code>	( or(parse_times_expr, parse_number)</span>
	, left => bind
		( or(parse_str('+'), parse_str('-'))
		, sign => bind
<span class=highlight-code>			( [parse_plus_expr, parse_times_expr, parse_number].reduce(or)</span>
			, right => retoorn([sign, left, right])
			)
		)
	)
```

ala izquierda _o_ ala derecha del plus puede ser un expresión de times!!

```
<span class=small>console.log(parse_plus_expr('1+2*3+4')) // { value: ['+', 1, ['+', ['*', 2, 3], 4]], rest: '' }</span>
```

¡¡omg funciona!! ¡¡ orden de evaluación!!! ¡¡¡¡¡¡¡que épico!!!

-----

## parenteheseis

what if we want to use partnehtis? we have to make a paren expression!!

what is 'paren expression'?? it's inside some parenethesis, just any expression!!.. plus epxression, times epxression, number.. all possible!!also, paren expression inside paren expression possible.

```
const parse_paren_expr = bind
	( parse_str('(')
	, lparen => bind
		( [parse_paren_expr, parse_plus_expr, parse_times_expr, parse_number].reduce(or)
		, expr => bind
			( parse_str(')')
			, rparen => retoorn(expr)
			)
		)
	)
```

nowe we must change times and plus expression.

```
const parse_times_expr = bind
<span class=highlight-code>	( or(parse_number, parse_paren_expr)</span>
	, left => bind
		( or(parse_str('*'), parse_str('/'))
		, sign => bind
<span class=highlight-code>			( [parse_times_expr, parse_number, parse_paren_expr].reduce(or)</span>
			, right => retoorn([sign, left, right])
			)
		)
	)
const parse_plus_expr = bind
<span class=highlight-code>	( [parse_times_expr, parse_number, parse_paren_expr].reduce(or)</span>
	, left => bind
		( or(parse_str('+'), parse_str('-'))
		, sign => bind
<span class=highlight-code>			( [parse_plus_expr, parse_times_expr, parse_number, parse_paren_expr].reduce(or)</span>
			, right => retoorn([sign, left, right])
			)
		)
	)
```

```
console.log(parse_plus_expr('(1+2)+3')) // { value: ['+', ['+', 1, 2], 3] }
```

oh??? it work?????cool

-----

## why is code so bad though??

```
<span class=small>// Parser tree
const parse_paren_expr = bind
	( parse_str('(')
	, lparen => bind
		( [parse_paren_expr, parse_plus_expr, parse_times_expr, parse_number].reduce(or)
		, expr => bind
			( parse_str(')')
			, rparen => retoorn(expr)
			)
		)
	)

// Parser tree
const parse_times_expr = bind
	( or(parse_number, parse_paren_expr)
	, left => bind
		( or(parse_str('*'), parse_str('/'))
		, sign => bind
			( [parse_times_expr, parse_number, parse_paren_expr].reduce(or)
			, right => retoorn([sign, left, right])
			)
		)
	)


// Parser tree
const parse_plus_expr = bind
	( [parse_times_expr, parse_number, parse_paren_expr].reduce(or)
	, left => bind
		( or(parse_str('+'), parse_str('-'))
		, sign => bind
			( [parse_plus_expr, parse_times_expr, parse_number, parse_paren_expr].reduce(or)
			, right => retoorn([sign, left, right])
			)
		)
	)</span>
```
-----

## make better

```
<span class=small>// Parser tree
const parse_paren_expr = bind
	( parse_str('(')
	, lparen => bind
!		( p_plus
		, expr => bind
			( parse_str(')')
			, rparen => retoorn(expr)
			)
		)
	)

!const p_base = or(parse_number, parse_paren_expr)

// Parser tree
const parse_times_expr = bind
!	( p_base
	, left => bind
		( or(parse_str('*'), parse_str('/'))
		, sign => bind
!			( p_times
			, right => retoorn([sign, left, right])
			)
		)
	)

!const p_times = or(parse_times_expr, p_base)

// Parser tree
const parse_plus_expr = bind
!	( p_times
	, left => bind
		( or(parse_str('+'), parse_str('-'))
		, sign => bind
!			( p_plus
			, right => retoorn([sign, left, right])
			)
		)
	)

!const p_plus = or(parse_plus_expr, p_times)
```

uhuononyonoynoynonyonyoynonyonyonyonyonyonyonyonyonyonyoynoynoynoyn

-----

# but, there actually is big problem!!!!!!!!!!i just found this out OMG!!

did you know that `1 - 2 - 3 =/= 1 - (2 - 3)`??? its true!!
```
1 - 2 - 3 = 1 - (2 - 3)
-1 - 3 = 1 - (-1)
-4 = 2
omg!!!!
```

subtraction is 'left associative'.. so is division!! omg what a tragedy!! because, this parser now only groups right associative.

```
1 - 2 - 3 - 4
right associative: 1 + (2 - (3 - 4))
left associative:  ((1 - 2) - 3) - 4
```

thats so sad!! how could we fix!!

-----

## oh we cant fix!!!!

oh actually, i think we couldnt fix because our parser is 'right recursive', meaning it starts at beginning of string and works right.. so now we were doing like this

```
plus expression is: <times expression> + <plus expression>
```

to make it left associative we would need to do

```
plus expression is: <plus expression> + <times expression>
```

which would become infinite recursion!! because to parse a plus expression, it would try to parse a plus expression. and to parse that plus expression, it would try to parse a plus expression. and to parse that plus expression, it would try to parse a plus expression. and to parse that plus expression, it would try to parse a plus expression. and to parse that plus expression, it would try to parse a plus expression. and to parse that plus expression, it would try to parse a plus expression. aghahah infinite recursión

-----

## oh actually maybe we could fix
actually, maybe we could parse `1-2-3` as `1 + (-2) + (-3)`!! but, it would not fit the current parser unless it were like some preprocessor that specifically converts only these expressions. because otherwise, what does `1*-2` equal?? `1 * + (-2)`?? etc. ohno!!

actually maybe there is other way also. like parsing long list of them without recursion. who knows? i do not actually know much about parsing!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


so, actually do not fix, and just remove subtraction and division from parser.

-----

```
// Parser tree
const parse_times_expr = bind
	( p_base
	, left => bind
!		( parse_str('*')
		, sign => bind
			( p_times
			, right => retoorn([sign, left, right])
			)
		)
	)

const p_times = or(parse_times_expr, p_base)

// Parser tree
const parse_plus_expr = bind
	( p_times
	, left => bind
!		( parse_str('+')
		, sign => bind
			( p_plus
			, right => retoorn([sign, left, right])
			)
		)
	)

const p_plus = or(parse_plus_expr, p_times)
```

-----

## parse multiple digit number

```
// Parser a -> Parser [a]
const many = p => str => {
	let got = []
	let remain = str

	while (true) {
		const { value, rest, failed } = p(remain)
		if (failed) break
		got.push(value)
		remain = rest
	}

	return got.length
		? { value: got, rest: remain }
		: { failed: true }
}

// Parser int
!const parse_number = bind
!	( many(parse_digit)
!	, digits => retoorn(parseInt(digits.join('')))
!	)
```

<ol>
<li>make function that turns parser that parses single thing into parser that parses many thing</li>
<li>edit `parse_number`</li>
<ol>

-----

## the end(1)

now, you have parser for simple arithmetic that doesnt work on subtraction or division!!

```
<span class=small>// Parser a, (a -> Parser b) -> Parser b
const bind = (old, make_new) => str => {
	const out = old(str)
	return out.failed
		? { failed: true }
		: make_new(out.value)(out.rest)
}

// a => Parser a
const retoorn = val => str => ({ rest: str, value: val })

// Parser a, Parser b -> Parser (a or b)
const or = (first, second) => str => {
	const result = first(str)
	if (!result.failed) return result
	return second(str)
}

// Parser a -> Parser [a]
const many = p => str => {
	let got = []
	let remain = str

	while (true) {
		const { value, rest, failed } = p(remain)
		if (failed) break
		got.push(value)
		remain = rest
	}

	return got.length
		? { value: got, rest: remain }
		: { failed: true }
}

// string -> Parser string
const parse_str = str_toParse => str => str.startsWith(str_toParse)
	? { value: str_toParse, rest: str.slice(str_toParse.length) }
	: { failed: true }

// Parser str
const parse_digit = '0123456789'.split('').map(parse_str).reduce(or)

// Parser int
const parse_number = bind
	( many(parse_digit)
	, digits => retoorn(parseInt(digits.join('')))
	)

// Parser tree
const parse_paren_expr = bind
	( parse_str('(')
	, lparen => bind
		( p_plus
		, expr => bind
			( parse_str(')')
			, rparen => retoorn(expr)
			)
		)
	)

const p_base = or(parse_number, parse_paren_expr)

// Parser tree
const parse_times_expr = bind
	( p_base
	, left => bind
		( parse_str('*')
		, sign => bind
			( p_times
			, right => retoorn([sign, left, right])
			)
		)
	)

const p_times = or(parse_times_expr, p_base)

// Parser tree
const parse_plus_expr = bind
	( p_times
	, left => bind
		( parse_str('+')
		, sign => bind
			( p_plus
			, right => retoorn([sign, left, right])
			)
		)
	)

const p_plus = or(parse_plus_expr, p_times)</span>
```


```
p_plus('112*3+(24*2+3)+4') => ["+",["*",112,3],["+",["+",["*",24,2],3],4]]
```
-----

## what ooo??????? i wrote 90 lines of code and i cant even subtraction or division, or put spaces in my string

that is true, but at least you wrote 40 lines of highly reusable code and invented monad or something

```
<span class=small>// Parser a, (a -> Parser b) -> Parser b
const bind = (old, make_new) => str => {
	const out = old(str)
	return out.failed
		? { failed: true }
		: make_new(out.value)(out.rest)
}

// a => Parser a
const retoorn = val => str => ({ rest: str, value: val })

// Parser a, Parser b -> Parser (a or b)
const or = (first, second) => str => {
	const result = first(str)
	if (!result.failed) return result
	return second(str)
}

// Parser a -> Parser [a]
const many = p => str => {
	let got = []
	let remain = str

	while (true) {
		const { value, rest, failed } = p(remain)
		if (failed) break
		got.push(value)
		remain = rest
	}

	return got.length
		? { value: got, rest: remain }
		: { failed: true }
}

// string -> Parser string
const parse_str = str_toParse => str => str.startsWith(str_toParse)
	? { value: str_toParse, rest: str.slice(str_toParse.length) }
	: { failed: true }
</span>
```

-----

you could parse arbitrary grammar so easily now with your 40 lines tools

lets parse simple XML

```
const parse_alphabet   = 'abcdefghijklmnopqrstuvwxyz'.split('').map(parse_str).reduce(or)
const parse_whitespace = ' \n\t'.split('').map(parse_str).reduce(or)

// Parser str => Parser str
const joined = parser => bind
	( many(parser)
	, ar => retoorn(ar.join(''))
	)

const parse_text = bind
	( joined(or(parse_alphabet, parse_whitespace))
	, value => retoorn({ type: 'text', value })
	)

const parse_node = bind
	( parse_str('<')
	, _ => bind
		( joined(parse_alphabet)
		, name => bind
			( parse_str('>')
			, _ => bind
				( or(many(parse_node), parse_text)
				, value => bind
					( parse_str(`</${name}>`)
					, _ => retoorn({ type: 'node', value, name })
					)
				)
			)
		)
	)
```
-----

wow,thats so epic bro
```
&lt;hi&gt;&lt;hi&gt;hello how are you bro&lt;/hi&gt;&lt;hi&gt;&lt;hello&gt;abc&lt;/hello&gt;&lt;/hi&gt;&lt;/hi&gt;
```

```
{
	"rest": "",
	"value": {
		"type": "node",
		"value": [
			{
				"type": "node",
				"value": {
					"type": "text",
					"value": "hello how are you bro"
				},
				"name": "hi"
			},
			{
				"type": "node",
				"value": [
					{
						"type": "node",
						"value": {
							"type": "text",
							"value": "abc"
						},
						"name": "hello"
					}
				],
				"name": "hi"
			}
		],
		"name": "hi"
	}
}
```
you could parse a simple xml with so little extra typing effort

-----

# conclution
we saw function. and then, made a parser out of a function. and then, made functions that transformed parsers. so eventually, we made small parsers, and then combined them into big parser. cool! this is called 'parser combinator'.

## compare to other parsing methods
tbh idrk how other parsing methods really work.. i think they use a lot of loops and stacks and queues or something i could not do that.. i actually only really know functions!!i lokve functions control flow? who is control flow i only kknow function

### dijkstras bunting muffin algorithm
there is an algorithm specifically for parsing two argument infix expressions like `1 - 2 - 3`, but the pseudocode was like 30 lines (without tokenisation = splitting up string as preprocessing step) of if statements. i could not would not mentally process that bro!!

## sources of error
error

## future work
you could make a cooler parser

-----

# any question?

i probably could not answer them haha hjust kidding maybe i could

-----

# slides with important code
<ul>
<li><a href=#slide-17>tree evaluation</a></li>
<li><a href=#slide-62>full code for simple arithmetic, no subtraction or division parser</a></li>
<li><a href=#slide-64>simple xml parser using reusable code from above</a></li>
</ul>

-----
-----
-----
-----
-----


```javascript

// Parser a, (a -> Parser b) -> Parser b
const bind = (old, make_new) => str => {
	const out = old(str)
	return out.failed
		? { failed: true }
		: make_new(out.value)(out.rest)
}

// a => Parser a
const retoorn = val => str => ({ rest: str, value: val })

// Parser a, Parser b -> Parser (a or b)
const or = (first, second) => str => {
	const result = first(str)
	if (!result.failed) return result
	return second(str)
}

// Parser a -> Parser [a]
const many = p => str => {
	let got = []
	let remain = str

	while (true) {
		const { value, rest, failed } = p(remain)
		if (failed) break
		got.push(value)
		remain = rest
	}

	return got.length
		? { value: got, rest: remain }
		: { failed: true }
}

// string -> Parser string
const parse_str = str_toParse => str => str.startsWith(str_toParse)
	? { value: str_toParse, rest: str.slice(str_toParse.length) }
	: { failed: true }

// Parser str
const parse_digit = '0123456789'.split('').map(parse_str).reduce(or)

// Parser int
const parse_number = bind
	( many(parse_digit)
	, digits => retoorn(parseInt(digits.join('')))
	)

// Parser tree
const parse_paren_expr = bind
	( parse_str('(')
	, lparen => bind
		( p_plus
		, expr => bind
			( parse_str(')')
			, rparen => retoorn(expr)
			)
		)
	)

const p_base = or(parse_number, parse_paren_expr)

// Parser tree
const parse_times_expr = bind
	( p_base
	, left => bind
		( parse_str('*')
		, sign => bind
			( p_times
			, right => retoorn([sign, left, right])
			)
		)
	)

const p_times = or(parse_times_expr, p_base)

// Parser tree
const parse_plus_expr = bind
	( p_times
	, left => bind
		( parse_str('+')
		, sign => bind
			( p_plus
			, right => retoorn([sign, left, right])
			)
		)
	)

const p_plus = or(parse_plus_expr, p_times)

const evaluate = tree => {
	if (typeof(tree) === 'number') return tree

	const [operator, left, right] = tree

	const x = evaluate(left)
	const y = evaluate(right)

	if (operator === '+') return x + y
	if (operator === '-') return x - y
	if (operator === '*') return x * y
	if (operator === '/') return x / y
}


console.log(JSON.stringify(p_plus('112*3+(24*2+3)+4')))


// ["+",1,["-",2,["-",["*",3,["+",1,["-",0,["+",1,2]]]],["*",3,9]]]]
console.log(p_plus('1+2-3*((1)+0-(1+2))-3*9'))

console.log(parse_plus_expr('1-2-3+4')) // { value: ['-', 1, ['-', 2, ['+', 3, 4]]], rest: '' }

console.log(parse_plus_expr('1+2+3+4+5'))    // { value: ['+', 1, 1], rest: '' }
console.log(parse_plus_expr('1+2abc')) // { value: ['+', 1, 2], rest: 'abc' }
console.log(parse_plus_expr('1+'))     // { failed: true }

console.log(JSON.stringify(parse_plus_expr('1+2+3+4+5')))
```

-----

-----