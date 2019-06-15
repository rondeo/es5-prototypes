"use strict";

// To "activate" a section, prefix the respective heading with another `/`.
// E.g., for section 1, you would change `/* 1. Constructors` to `//* 1. Constructors`.

/* 1. Constructors

// Constructors are simply functions that are used with `new` to create objects.
// The only difference is that constructors' names should begin with a capital letter.

var Person = function() {};

var person = new Person();

// `person` is an instance of the `Person` type.
// `instanceof` as well as the `constructor` property can be used to determine its type.

console.log(person instanceof Person); // true
console.log(person.constructor == Person); // true, but careful: this property can be overwritten!

// Constructors exist to make it possible to create many objects with the same properties.
// Properties can be added to `this` inside the constructor.
// The `this` object is automatically created by `new` when you call the constructor.
// The `new` operator also returns it, so there is no need to explicitly return.

Person = function(name) {
  this.name = name;
  this.sayName = function() {
    console.log(this.name);
  };
};

person = new Person("jsfanboy");
person.sayName(); // jsfanboy

// Caution, omitting `new` here would populate the `global` object.
// This, however, throws an error in strict mode, so you need to comment it out in line 1.

// person = Person("jsfanboy 2");
// console.log(typeof(person)); // undefined
// console.log(name); // jsfanboy 2

//*/

/* 2. Prototypes

// Almost every function has a `prototype` property that is used during the creation of instance.
// Although the method "hasOwnProperty" is not going to be defined on book, it can be accessed.
// That is because the definition does exist on `Object.prototype`.

var book = new Object(); // jshint ignore:line
book.title = "ES5 Prototypes";

console.log("title" in book); // true
console.log("hasOwnProperty" in book); // true
console.log(book.hasOwnProperty("title")); // true

// Analogously to "hasOwnProperty", we could define "hasPrototypeProperty":

var hasPrototypeProperty = function(object, name) {
  return name in object && !object.hasOwnProperty(name);
};

console.log(hasPrototypeProperty(book, "title")); // false
console.log(hasPrototypeProperty(book, "hasOwnProperty")); // true

// Consider the following illustration.
// An instance refers to its prototype with a property called `[[Prototype]]`.
// `new` creates an instance and sets its `[[Prototype]]` to the constructor's `prototype` property.

// ../img/the-prototype-property.monopic
// ┌───────────────────────────┐                                
// │          person1          │                                
// ├─────────────┬─────────────┤                                
// │[[Prototype]]│      ●──────┼─────────────────┐              
// ├─────────────┼─────────────┤                 ▼              
// │    name     │ "jsfanboy"  │   ┌───────────────────────────┐
// └─────────────┴─────────────┘   │     Person.prototype      │
//                                 ├─────────────┬─────────────┤
// ┌───────────────────────────┐   │   sayName   │ <function>  │
// │          person2          │   └─────────────┴─────────────┘
// ├─────────────┬─────────────┤                 ▲              
// │[[Prototype]]│      ●──────┼─────────────────┘              
// ├─────────────┼─────────────┤                                
// │    name     │"jsfanboy 2" │                                
// └─────────────┴─────────────┘                                

// An instance's `[[Prototype]]` can be read using `Object.getPrototypeOf()`.

var someObject = new Object(); // jshint ignore:line
var someObjectsPrototype = Object.getPrototypeOf(someObject);
console.log(someObjectsPrototype === Object.prototype); // true, as it is for any generic object.

// Many browsers also support `__proto__` property to read from and write to the `[[Prototype]]`.

console.log(someObject.__proto__ === Object.prototype); // jshint ignore:line

// It is possible to test whether one object is a prototype of another by using `isPrototypeOf()`.

console.log(Object.prototype.isPrototypeOf(someObject)); // true

// When an object's property is accessed, the engine first looks for an own property of that name.
// If it cannot find one, it searches the `[[Prototype]]` object instead.
// If the search concludes without finding said property, `undefined` is returned.

console.log(someObject.toString());

someObject.toString = function() {
  return "some custom string";
}; 

console.log(someObject.toString());

//*/

/* 3. Using Prototypes with Constructors

// Methods tend to do the same for all instances, it’s more efficient to put them on the prototype.
// The current instance can be accessed using `this`.
// Consider the following new `Person` constructor.

var Person = function(name) {
  this.name = name;
};

Person.prototype.sayName = function() {
  console.log(this.name);
};

var person1 = new Person("jsfanboy");
var person2 = new Person("jsfanboy 2");

person1.sayName(); // jsfanboy
person2.sayName(); // jsfanboy 2

// You can also store reference values on the prototype, but be careful when doing so.
// These values are shared across instances, which might lead to unintended behavior.

Person.prototype.favorites = [];

person1.favorites.push("Pizza");
person2.favorites.push("Burgers");

console.log(person1.favorites); // [ 'Pizza', 'Burgers' ]

// While you can add properties to the prototype one by one, many replace it with an object literal.
// However, this would change the `constructor` property to point to `Object` instead of `Person`.
// Therefore, it is good practice to specifically assign `constructor.`

Person.proptotype = {
  constructor: Person,
  sayName: function() {
    console.log(this.name);
  },
  toString: function() {
    return "[Person " + this.name + "]";
  }
};

var person3 = new Person("jsfanboy 3");

person3.sayName(); // jsfanboy 3

console.log(person3 instanceof Person); // true
console.log(person3.constructor === Person); // true, since we explicitly assigned it.
console.log(person3.constructor === Object); // false, but would have been true if we hadn't.

// This shows how there is no direct link between the instance and the constructor.
// However, there obviously is a direct link
// (a) between the instance and the prototype, as well as 
// (b) between the prototype and the constructor.

// ../img/links-between-instance-constructor-and-prototype.monopic
// ┌───────────────────────────┐                                                                  
// │          person1          │                                                                  
// ├─────────────┬─────────────┤                                                                  
// │[[Prototype]]│      ●──────┼────────────────┐ ┌──────────────────────────────────────────────┐
// ├─────────────┼─────────────┤                ▼ ▼                                              │
// │    name     │ "jsfanboy"  │   ┌───────────────────────────┐                                 │
// └─────────────┴─────────────┘   │     Person.prototype      │                                 │
//                                 ├─────────────┬─────────────┤   ┌───────────────────────────┐ │
//                                 │ constructor │      ●──────┼──▶│          Person           │ │
//                                 ├─────────────┼─────────────┤   ├─────────────┬─────────────┤ │
//                                 │   sayName   │ <function>  │   │  prototype  │      ●──────┼─┘
//                                 ├─────────────┼─────────────┤   └─────────────┴─────────────┘  
// ┌───────────────────────────┐   │  toString   │ <function>  │                                  
// │          person2          │   └─────────────┴─────────────┘                                  
// ├─────────────┬─────────────┤                 ▲                                                
// │[[Prototype]]│      ●──────┼─────────────────┘                                                
// ├─────────────┼─────────────┤                                                                  
// │    name     │"jsfanboy 2" │                                                                  
// └─────────────┴─────────────┘                                                                  

//*/

/* 4. Changing Prototypes

// All instances of a particular type reference a shared prototype.
// Therefore, you can augment all of those objects together at any time by augmenting it.

var Person = function(name) {
  this.name = name;
};

Person.proptotype = {
  constructor: Person,
  sayName: function() {
    console.log(this.name);
  },
  toString: function() {
    return "[Person " + this.name + "]";
  }
};

var person1 = new Person("jsfanboy");
var person2 = new Person("jsfanboy 2");

console.log("sayHi" in person1); // false
console.log("sayHi" in person2); // false

Person.prototype.sayHi = function() {
  console.log("Hi!");
};

person1.sayHi(); // Hi!
person2.sayHi(); // Hi!

// The ability to modify the prototype has  repercussions on `Object.seal()` or `Object.freeze()`.
// When you use those, you are acting solely on the object instance and the own properties.
// You can certainly still add properties on the prototype.

//*/

/* 5. Built-in objects

// All built-in objects have constructors, and therefore, they have prototypes that you can change.

Array.prototype.sum = function() {
  return this.reduce(function(previous, current) {
    return previous + current;
  });
};

var numbers = [ 1, 2, 3, 4, 5, 6 ];

console.log(numbers.sum()); // 21

// strings, numbers, and booleans all have built-in primitive wrapper types.
// You can modify the primitive wrapper type prototype.

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.substring(1);
};

var message = "hello, world!";
console.log(message.capitalize());  // Hello, world!

//*/
