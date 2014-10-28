/**
 * QueryExpression
 */
function QueryExpression(json) {
  if (json instanceof Object) {
    this.json = json;
  }
}

QueryExpression.prototype.and = function(expression) {
	return new AndExpression(this, expression);
};

QueryExpression.prototype.or = function(expression) {
  return new OrExpression(this, expression);
};

QueryExpression.prototype.toJSON = function() {
  return this.json;
};

/**
 * NaryLogicalExpression
 */
function NaryLogicalExpression(op, expressions) {
  this.op = op;
  this.expressions = expressions || [];

  if (expressions instanceof Array) {
    var json = {};
    
    json[op] = expressions.map(function (e) { 
      return e.asJson(); 
    });
  }

  QueryExpression.call(this, json);
}

NaryLogicalExpression.prototype = new QueryExpression();
NaryLogicalExpression.prototype.constructor = NaryLogicalExpression;

/**
 * AndExpression
 */
function AndExpression(expressions) {
  if (!(expressions instanceof Array)) {
    expressions = Array.prototype.slice.call(arguments, 0);
  }

  NaryLogicalExpression.call(this, "$and", expressions);
}

AndExpression.prototype = new NaryLogicalExpression();
AndExpression.prototype.constructor = AndExpression;

AndExpression.prototype.and = function(expression) {
  return new AndExpression(this.expressions.concat(expression));
};

/**
 * OrExpression
 */
function OrExpression(expressions) {
  if (!(expressions instanceof Array)) {
    expressions = Array.prototype.slice.call(arguments, 0);
  }

  NaryLogicalExpression.call(this, "$or", expressions);
}

OrExpression.prototype = new NaryLogicalExpression();
OrExpression.prototype.constructor = OrExpression;

OrExpression.prototype.or = function(expression) {
  return new OrExpression(this.expressions.concat(expression));
};

/**
 * Field
 */
function Field(field) {
	this.field = field;
}

Field.prototype.__comparison = function(op, value) {
  if (value instanceof Field) {
    return new FieldComparison(this.field, op, value.field);
  }

  return new ValueComparison(this.field, op, value);
};

Field.prototype.equalTo = Field.prototype.eq = function(value) {
	return this.__comparison("$eq", value);
};

Field.prototype.greaterThan = Field.prototype.gt = function(value) {
  return this.__comparison("$gt", value);
};

/**
 * FieldComparison
 */
function FieldComparison(field, op, rfield) {
	QueryExpression.call(this, {
    "field": field,
    "op": op,
    "rfield": rfield
  });
}

FieldComparison.prototype = new QueryExpression();
FieldComparison.prototype.constructor = FieldComparison;

/**
 * ValueComparison
 */
function ValueComparison(field, op, rvalue) {
  QueryExpression.call(this, {
    "field": field,
    "op": op,
    "rvalue": rvalue
  });
}

ValueComparison.prototype = new QueryExpression();
ValueComparison.prototype.constructor = ValueComparison;

function field(name) {
  return new Field(name);
}