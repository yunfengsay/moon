import compiler from "moon-compiler/src/index";

function assertGenerate(input, output) {
	expect(compiler.compile(input)).toEqual(output);
}

test("generate static element", () => {
	assertGenerate(
		"<div><h1>Test</h1><p>test</p></div>",
		"Moon.view.components.div({children:[Moon.view.components.h1({children:[Moon.view.components.text({data:\"Test\"})]}),Moon.view.components.p({children:[Moon.view.components.text({data:\"test\"})]})]})"
	);
});

test("generate static element with escaped text", () => {
	assertGenerate(
		"<div>foo \\{ bar \\< baz \\\" \" \\\n \n</div>",
		`Moon.view.components.div({children:[Moon.view.components.text({data:"foo \\{ bar \\< baz \\\" \\\" \\\n \\n\\\n"})]})`
	);
});

test("generate static element with escaped text at start", () => {
	assertGenerate(
		"<div>\nTest</div>",
		`Moon.view.components.div({children:[Moon.view.components.text({data:"\\n\\
Test"})]})`
	);
});

test("generate static element with whitespace only nodes", () => {
	assertGenerate(
		`<div>
			<h1>Test</h1>
			<p>test</p>
		</div>`,
		`Moon.view.components.div({children:[
			Moon.view.components.h1({children:[Moon.view.components.text({data:\"Test\"})]})
			,Moon.view.components.p({children:[Moon.view.components.text({data:\"test\"})]})
		]})`
	);
});

test("generate dynamic element", () => {
	assertGenerate(
		"<div><h1>Test</h1><p>test {message}</p></div>",
		"Moon.view.components.div({children:[Moon.view.components.h1({children:[Moon.view.components.text({data:\"Test\"})]}),Moon.view.components.p({children:[Moon.view.components.text({data:\"test \"}),Moon.view.components.text({data:message})]})]})"
	);
});

test("generate static attributes", () => {
	assertGenerate(
		"<div><h1 id='bar' class='foo'>Test</h1><p>test {message}</p></div>",
		"Moon.view.components.div({children:[Moon.view.components.h1 ({\"id\":'bar' ,\"class\":'foo',children:[Moon.view.components.text({data:\"Test\"})]}),Moon.view.components.p({children:[Moon.view.components.text({data:\"test \"}),Moon.view.components.text({data:message})]})]})"
	);
});

test("generate dynamic attributes", () => {
	assertGenerate(
		"<div><h1 id='bar' class=(foo)>Test</h1><p>test {message}</p></div>",
		"Moon.view.components.div({children:[Moon.view.components.h1 ({\"id\":'bar' ,\"class\":(foo),children:[Moon.view.components.text({data:\"Test\"})]}),Moon.view.components.p({children:[Moon.view.components.text({data:\"test \"}),Moon.view.components.text({data:message})]})]})"
	);
});

test("generate dynamic data attribute", () => {
	assertGenerate(
		"<div foo=(bar) bar=(data)></div>",
		"Moon.view.components.div ({\"foo\":(bar) ,\"bar\":(data)})"
	);
});

test("generate static children attribute", () => {
	assertGenerate(
		"<div foo=(bar) children='fake'></div>",
		"Moon.view.components.div ({\"foo\":(bar) ,\"children\":'fake'})"
	);
});

test("generate dynamic children attribute", () => {
	assertGenerate(
		"<div children=(children)></div>",
		"Moon.view.components.div ({\"children\":(children)})"
	);
});

test("generate events", () => {
	assertGenerate(
		"<div><h1 id='bar' class=(foo) onClick=(doSomething)>Test</h1><p>test {message}</p></div>",
		"Moon.view.components.div({children:[Moon.view.components.h1 ({\"id\":'bar' ,\"class\":(foo) ,\"onClick\":(doSomething),children:[Moon.view.components.text({data:\"Test\"})]}),Moon.view.components.p({children:[Moon.view.components.text({data:\"test \"}),Moon.view.components.text({data:message})]})]})"
	);
});

test("generate static components", () => {
	assertGenerate(
		"<div><Component/></div>",
		"Moon.view.components.div({children:[Component({})]})"
	);
});

test("generate static components with dot and first character lowercase", () => {
	assertGenerate(
		"<div><test.Component/></div>",
		"Moon.view.components.div({children:[test.Component({})]})"
	);
});

test("generate static components with data", () => {
	assertGenerate(
		"<div><Component foo='bar' bar='baz'/></div>",
		"Moon.view.components.div({children:[Component ({\"foo\":'bar' ,\"bar\":'baz'})]})"
	);
});

test("generate static components with children", () => {
	assertGenerate(
		"<div><Component foo='bar' bar='baz'><p>static</p></Component></div>",
		"Moon.view.components.div({children:[Component ({\"foo\":'bar' ,\"bar\":'baz',children:[Moon.view.components.p({children:[Moon.view.components.text({data:\"static\"})]})]})]})"
	);
});

test("generate dynamic components with data", () => {
	assertGenerate(
		"<div><Component foo=(bar) bar='baz'/></div>",
		"Moon.view.components.div({children:[Component ({\"foo\":(bar) ,\"bar\":'baz'})]})"
	);
});

test("generate dynamic components with children", () => {
	assertGenerate(
		"<div><Component foo=(bar) bar='baz'><p>{message}</p></Component></div>",
		"Moon.view.components.div({children:[Component ({\"foo\":(bar) ,\"bar\":'baz',children:[Moon.view.components.p({children:[Moon.view.components.text({data:message})]})]})]})"
	);
});

test("generate text directly", () => {
	assertGenerate(
		"<text value=(foo)/>",
		`Moon.view.components.text ({"value":(foo)})`
	);
});

test("generate static element nodes", () => {
	assertGenerate(
		"<element name='h1' data='fake data' children='fake children'/>",
		"Moon.view.components.element ({\"name\":'h1' ,\"data\":'fake data' ,\"children\":'fake children'})"
	);
});

test("generate static data element nodes", () => {
	assertGenerate(
		"<element name='h1' data='static' children=(dynamic)/>",
		"Moon.view.components.element ({\"name\":'h1' ,\"data\":'static' ,\"children\":(dynamic)})"
	);
});

test("generate static children element nodes", () => {
	assertGenerate(
		"<element name='h1' data={dynamic: dynamic} children=[]/>",
		"Moon.view.components.element ({\"name\":'h1' ,\"data\":{dynamic: dynamic} ,\"children\":[]})"
	);
});

test("generate dynamic element nodes", () => {
	assertGenerate(
		"<element name='h1' data=(dynamic) children=(dynamicChildren)/>",
		"Moon.view.components.element ({\"name\":'h1' ,\"data\":(dynamic) ,\"children\":(dynamicChildren)})"
	);
});

test("generate if node", () => {
	assertGenerate(
		`<div><(condition ? <p>test</p> : <text value=""/>)*></div>`,
		"Moon.view.components.div({children:[(condition ? Moon.view.components.p({children:[Moon.view.components.text({data:\"test\"})]}) : Moon.view.components.text ({\"value\":\"\"}))]})"
	);
});

test("generate if node at root", () => {
	assertGenerate(
		`<(condition ? <p>test</p> : <text value=""/>)*>`,
		"(condition ? Moon.view.components.p({children:[Moon.view.components.text({data:\"test\"})]}) : Moon.view.components.text ({\"value\":\"\"}))"
	);
});

test("generate if/else node", () => {
	assertGenerate(
		"<(condition ? <p>test</p> : <p>{dynamic}</p>)*>",
		"(condition ? Moon.view.components.p({children:[Moon.view.components.text({data:\"test\"})]}) : Moon.view.components.p({children:[Moon.view.components.text({data:dynamic})]}))"
	);
});

test("generate loop", () => {
	assertGenerate(
		"<span children=(list.map(x => <p>{x}</p>))/>",
		"Moon.view.components.span ({\"children\":(list.map(x => Moon.view.components.p({children:[Moon.view.components.text({data:x})]})))})"
	);
});

test("generate node with name as identifier", () => {
	assertGenerate(
		`<div*>`,
		`Moon.view.components.div`
	);
});

test("generate node with name as string", () => {
	assertGenerate(
		`<"div foo"*>`,
		`"div foo"`
	);
});

test("generate node with name as block", () => {
	assertGenerate(
		`<(div + foo)*>`,
		`(div + foo)`
	);
});

test("generate node data with name as identifier", () => {
	assertGenerate(
		`<div/>`,
		`Moon.view.components.div({})`
	);
});

test("generate node data with name as string", () => {
	assertGenerate(
		`<"div foo"/>`,
		`"div foo"({})`
	);
});

test("generate node data with name as block", () => {
	assertGenerate(
		`<(div + foo)/>`,
		`(div + foo)({})`
	);
});

test("generate node data with name as block and data as block", () => {
	assertGenerate(
		`<(div + foo) (custom)/>`,
		`(div + foo) ((custom))`
	);
});

test("generate node data with name as block and data as attributes", () => {
	assertGenerate(
		`<(div + foo) foo="bar" bar=baz baz=(foo)/>`,
		`(div + foo) ({\"foo\":\"bar\" ,\"bar\":baz ,\"baz\":(foo)})`
	);
});

test("generate node data children with name as block and data as attributes", () => {
	assertGenerate(
		`<(div + foo) foo="bar" bar=baz baz=(foo)></>`,
		`(div + foo) ({\"foo\":\"bar\" ,\"bar\":baz ,\"baz\":(foo)})`
	);
});

test("generate node data children with name as identifier and data as attributes", () => {
	assertGenerate(
		`<div foo="bar" bar=baz baz=(foo)>child <div>here {foo}</div></div>`,
		`Moon.view.components.div ({\"foo\":\"bar\" ,\"bar\":baz ,\"baz\":(foo),children:[Moon.view.components.text({data:\"child \"}),Moon.view.components.div({children:[Moon.view.components.text({data:\"here \"}),Moon.view.components.text({data:foo})]})]})`
	);
});

test("generate with comments", () => {
	const code = `// <h1>not converted</h1>\n`;
	assertGenerate(code, code);
});

test("generate with multiline comments", () => {
	const code = `/*\n<h1>not converted</h1>\n*/`;
	assertGenerate(code, code);
});

test("generate with moon comments outside of node", () => {
	assertGenerate(`console.log(# comment\\# # "hello moon")`, "console.log(/* comment\\# */ \"hello moon\")");
});

test("generate with moon comments inside node", () => {
	assertGenerate(`const hi = #test#<#sep#div#sep#foo=bar#sep##sep##sep#>test</div>#foo#;`, `const hi = /*test*//*sep*/Moon.view.components.div/*sep*/({\"foo\":bar/*sep*//*sep*//*sep*/,children:[Moon.view.components.text({data:\"test\"})]})/*foo*/;`);
});

test("generate with double quote strings", () => {
	const code = `"<h1>not converted</h1>"`;
	assertGenerate(code, code);
});

test("generate with single quote strings", () => {
	const code = `'<h1>not converted</h1>'`;
	assertGenerate(code, code);
});

test("generate with template strings", () => {
	const code = "`<h1>not converted</h1>`";
	assertGenerate(code, code);
});

test("generate with regular expressions", () => {
	const code = "/<h1*>/";
	assertGenerate(code, code);
});

test("generate other expressions", () => {
	const code = "(1 + 1)";
	assertGenerate(code, code);
});

test("generate other complex nested expressions", () => {
	const code = "(1 + ('hello\\'' + `world\\\"`))";
	assertGenerate(code, code);
});

test("generate other complex nested expressions inside views", () => {
	assertGenerate(
		"<h1 test=(1 + ('hello\\'' + `world\\\"`))>Test</h1>",
		"Moon.view.components.h1 ({\"test\":(1 + ('hello\\'' + `world\\\"`)),children:[Moon.view.components.text({data:\"Test\"})]})"
	);
});

test("generate views with surrounding whitespace", () => {
	assertGenerate(
		`(
	<p>Moon</p>
)`,
		`(
	Moon.view.components.p({children:[Moon.view.components.text({data:\"Moon\"})]})
)`
	);
});

test("fails on invalid parse nodes", () => {
	expect(compiler.generate({type: "invalid"})).toBeUndefined();
});
