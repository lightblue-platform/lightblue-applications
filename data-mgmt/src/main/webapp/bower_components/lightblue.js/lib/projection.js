include("firstname").and("lastname");

include("*").recursively()
  .exclude("firstname");

in("address.*").where(field("city").equalTo("Raleigh"))
  .withProjection(include("streetaddress"))
  .include()
  .exclude()
  .exclude();

include("streetaddress").in("address.*").where(field("city").equalTo("Raleigh"));

(include("streetaddress").include("somethingElse")).in("address.*").where(field("city").equalTo("Raleigh"));

in("address.*").from(0).to(4).include("*").recursively();

include("*").recursively().in("address.*").from(0).to(4);)