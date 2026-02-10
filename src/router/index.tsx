import { Route, Switch } from "wouter";
import Users from "../views/Users";
import Posts from "../views/Posts";
import Detail from "../views/Detail";
import Star from "../views/Star";

const App = () => {
  return (
    <Switch>
      <Route path="/" component={Users} />
      <Route path="/users" component={Users} />
      <Route path="/posts/:userId" component={Posts} />
      <Route path="/detail/:id" component={Detail} />
      <Route path="/stars" component={Star} />
    </Switch>
  );
};

export default App;
