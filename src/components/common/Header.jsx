import { useState } from 'react'
import {  useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom'
import { Navbar, Nav, Container, Badge } from 'react-bootstrap'


const routes = [
    { path: "/", name: "首頁" },
    { path: "/product", name: "商品" },
    { path: "/about", name: "關於我們" },
    { path: "/blog", name: "部落格" },
    { path: "/cart", name: "購物車" },
];

const Header = () => {
    const carts = useSelector((state) => state.cart.carts);

    //test
    const [expanded, setExpanded] = useState(false)

  return (
    <Navbar
      expand="lg"
      bg="white"
      expanded={expanded}
      onToggle={setExpanded}
      className="shadow-sm position-sticky top-0 z-3"
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          陶瓷電商
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav className="align-items-center">
            {routes.map((route) => (
              <Nav.Link
              key={route.path}
              as={NavLink}
              to={route.path}
              onClick={() => setExpanded(false)}
              className="fw-bold header-hover me-4"
            >
              {route.name === '購物車' ? (
                <span className="position-relative">
                  <i className="fas fa-shopping-cart"></i>
                  <Badge
                    bg="success"
                    pill
                    className="position-absolute"
                    style={{ bottom: '10px', left: '15px' }}
                  >
                    {carts?.length}
                  </Badge>
                </span>
              ) : (
                route.name
              )}
            </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
