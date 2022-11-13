import { Route } from 'react-router-dom';
import Home from '../Home';
import { Movies, Shows, Books } from '../ProductList';

export default routes = (
  <Route path='/' component={Home}>
    <Route exact path='movies' component={Movies} />
    <Route exact path='shows' component={Shows} />
    <Route exact path='books' component={Books} />
  </Route>
)
