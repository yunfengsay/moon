import Moon from "moon/src/index";
const components = Moon.view.components;
const testFocusFalse = { focus: false };
const testInput = <components.input/>;

let root = document.createElement("span");
let eventResult;
root.id = "app";
document.body.appendChild(root);

const cache = {};

function shuffle(arr) {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}

	return arr;
}

function handler1(event) {
	eventResult = event;
}

function handler2(event) {
	eventResult = event;
}

function ExecutorTestItem({ item, index }) {
	if (item in cache) {
		const cacheItem = cache[item];

		if (index in cacheItem) {
			return cacheItem[index];
		}
	} else {
		cache[item] = {};
	}

	return (cache[item][index] =
		<components.span>
			<(item % 2 === 0 ?
				<components.p lang="en" class=item for=item attributes={"aria-hidden": false, "aria-removeme": true, "data-foo": "bar", "data-removeme": true} style={color: "red", background: "blue"} onClick=handler1>{item} {index}</p> :
			item % 3 === 0 ?
				<components.p lang="en" class=item for=item id=item attributes={"aria-hidden": false, "aria-different": true, "data-foo": "bar", "data-different": true} style={color: "red", fontSize: "20px"} onClick=handler2>{item} {index}</p> :
				<components.p lang="en">{item} {index}</p>
			)*>
		</components.span>
	);
}

function ExecutorTest() {
	const list = Moon.data.list;

	return (
		<components.div>
			<components.span children=(list.map((item, index) => <ExecutorTestItem item=item index=index/>))/>
			<components.span children=(list.map(item => <(
				item % 2 === 0 ?
					<components.h1>{item}</components.h1> :
					<components.p>{item}</components.p>
			)*>))/>
			<components.h1>Moon</components.h1>
			<components.p onClick=handler1 onDblClick=handler2>Partially static.</components.p>
			<(list.length > 0 ?
				(list[0] % 2 === 0 ?
					<components.input focus=true/> :
				list[0] % 3 === 0 ?
					<components.input focus=false/> :
					<testInput*>
				) :
				<components.text data=""/>
			)*>
			<components.input testFocusFalse/>
			<(list.length > 0 ?
				<components.p>Text</components.p> :
				<components.p/>
			)*>
			<(list.length > 0 ?
				<components.text data="Text"/> :
				<components.text/>
			)*>
		</components.div>
	);
}

Moon.configure({ view: { root } });
Moon.data.list = [];
Moon.view.render(<ExecutorTest/>);

root = document.body.firstChild;

function verify(list) {
	const span = root.firstChild;
	const span2 = span.nextSibling;

	for (let i = 0; i < list.length; i++) {
		const item = list[i];
		const element = span.childNodes[i].firstChild;
		const element2 = span2.childNodes[i];

		if (item % 2 === 0) {
			expect(element.tagName).toEqual("P");
			expect(element.lang).toEqual("en");
			expect(element.className).toEqual(item.toString());
			expect(element.htmlFor).toEqual(item);
			expect(element.id).toEqual("");
			expect(element.getAttribute("aria-hidden")).toEqual("false");
			expect(element.getAttribute("aria-removeme")).toEqual("true");
			expect(element.getAttribute("aria-different")).toBeNull();
			expect(element.dataset.foo).toEqual("bar");
			expect(element.dataset.removeme).toEqual("true");
			expect(element.dataset.different).toBeUndefined();
			expect(element.style.color).toEqual("red");
			expect(element.style.background).toEqual("blue");
			expect(element.style.fontSize).toEqual("");
			expect(element.onclick).toBeDefined();
			expect(element.textContent).toEqual(`${item} ${i}`);

			element.click();

			expect(eventResult.constructor).toEqual(MouseEvent);

			eventResult = undefined;
		} else if (item % 3 === 0) {
			expect(element.tagName).toEqual("P");
			expect(element.lang).toEqual("en");
			expect(element.className).toEqual(item.toString());
			expect(element.htmlFor).toEqual(item);
			expect(element.id).toEqual(item.toString());
			expect(element.getAttribute("aria-hidden")).toEqual("false");
			expect(element.getAttribute("aria-removeme")).toBeNull();
			expect(element.getAttribute("aria-different")).toEqual("true");
			expect(element.dataset.foo).toEqual("bar");
			expect(element.dataset.removeme).toBeUndefined();
			expect(element.dataset.different).toEqual("true");
			expect(element.style.color).toEqual("red");
			expect(element.style.background).toEqual("");
			expect(element.style.fontSize).toEqual("20px");
			expect(element.onclick).toBeDefined();
			expect(element.textContent).toEqual(`${item} ${i}`);

			element.click();

			expect(eventResult.constructor).toEqual(MouseEvent);

			eventResult = undefined;
		} else {
			expect(element.tagName).toEqual("P");
			expect(element.lang).toEqual("en");
			expect(element.className).toEqual("");
			expect(element.htmlFor === "" || element.htmlFor === undefined).toBeTruthy();
			expect(element.id).toEqual("");
			expect(element.getAttribute("aria-hidden")).toBeNull();
			expect(element.getAttribute("aria-removeme")).toBeNull();
			expect(element.getAttribute("aria-different")).toBeNull();
			expect(element.dataset.foo).toBeUndefined();
			expect(element.dataset.removeme).toBeUndefined();
			expect(element.dataset.different).toBeUndefined();
			expect(element.style.color).toEqual("");
			expect(element.style.background).toEqual("");
			expect(element.style.fontSize).toEqual("");
			expect(element.textContent).toEqual(`${item} ${i}`);
			expect(element.onclick).toBeNull();

			element.click();

			expect(eventResult).toBeUndefined();
		}

		if (item % 2 === 0) {
			expect(element2.tagName).toEqual("H1");
		} else {
			expect(element2.tagName).toEqual("P");
		}
	}

	const h1 = span2.nextSibling;

	expect(h1.tagName).toEqual("H1");
	expect(h1.textContent).toEqual("Moon");

	const p = h1.nextSibling;

	expect(p.tagName).toEqual("P");
	expect(p.textContent).toEqual("Partially static.");
	expect(p.onclick).toEqual(handler1);
	expect(p.ondblclick).toEqual(handler2);

	const input = p.nextSibling;

	if (list.length > 0) {
		const listFirst = list[0];

		expect(input.tagName).toEqual("INPUT");

		if (listFirst % 2 === 0) {
			expect(document.activeElement).toBe(input);
		} else if (listFirst % 3 === 0) {
			expect(document.activeElement).not.toBe(input);
		} else {
			expect(document.activeElement).not.toBe(input);
		}
	} else {
		expect(input.nodeName).toEqual("#text");
		expect(input.textContent).toEqual("");
	}

	const inputBlurred = input.nextSibling;

	expect(inputBlurred.tagName).toEqual("INPUT");
	expect(document.activeElement).not.toBe(inputBlurred);

	const pChildren = inputBlurred.nextSibling;

	if (list.length > 0) {
		expect(pChildren.textContent).toEqual("Text");
	} else {
		expect(pChildren.textContent).toEqual("");
		expect(pChildren.childNodes.length).toEqual(0);
	}

	const textRemove = pChildren.nextSibling;

	if (list.length > 0) {
		expect(textRemove.data).toEqual("Text");
	} else {
		expect(textRemove.data).toEqual("");
	}
}

function assertExecute(before, after) {
	Moon.data.list = before;
	Moon.view.render(<ExecutorTest/>);
	verify(before);

	Moon.data.list = after;
	Moon.view.render(<ExecutorTest/>);
	verify(after);
}

// Replace
for (let i of [2, 3, 5]) {
	for (let j of [2, 3, 5]) {
		test(`[${i}] -> [${j}]`, () => {
			assertExecute([i], [j]);
		});
	}
}

// Append
for (let i of [2, 3, 5]) {
	for (let j of [2, 3, 5]) {
		const before = [i];
		const after = [j, j + 1, j + 2, j + 3, j * 2];

		test(`[${before.toString()}] -> [${after.toString()}]`, () => {
			assertExecute(before, after);
		});
	}
}

// Remove
for (let i of [2, 3, 5]) {
	for (let j of [2, 3, 5]) {
		const before = [i, i + 1, i + 2, i + 3, i * 2];
		const after = [j];

		test(`[${before.toString()}] -> [${after.toString()}]`, () => {
			assertExecute(before, after);
		});
	}
}

// Remove (clear)
for (let i of [2, 3, 5]) {
	const before = [i, i + 1, i + 2, i + 3, i * 2];
	const after = [];

	test(`[${before.toString()}] -> [${after.toString()}]`, () => {
		assertExecute(before, after);
	});
}

// Fuzz
for (let i of Array.from({ length: 100 })) {
	const before = shuffle(Array.from({ length: Math.floor(Math.random() * 100) }).map(x => Math.floor(Math.random() * 25)));
	const after = shuffle(Array.from({ length: Math.floor(Math.random() * 100) }).map(x => Math.floor(Math.random() * 25)));

	test(`fuzz [${before.toString()}] -> [${after.toString()}]`, () => {
		assertExecute(before, after);
	});
}

// Nodes
const names = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "bgsound", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "command", "content", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "image", "img", "input", "ins", "isindex", "kbd", "keygen", "label", "legend", "li", "link", "listing", "main", "map", "mark", "marquee", "math", "menu", "menuitem", "meta", "meter", "multicol", "nav", "nextid", "nobr", "noembed", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "plaintext", "pre", "progress", "q", "rb", "rbc", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "text", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "xmp"];
const data = { foo: "bar" };

expect(components.node("custom")(data)).toEqual({ name: "custom", data });

for (let name of names) {
	expect(components[name](data)).toEqual({ name, data });
}
