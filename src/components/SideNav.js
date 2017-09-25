import React, {Component} from 'react';
import './SideNav.css';
import {SideNavLink} from './'

export class SideNav extends Component {
    render() {
        let sideNavLinks = this.props.links.map(link=><SideNavLink key={link.to} to={link.to} icon={link.icon} exact={link.exact}>{link.content}</SideNavLink>)
        return (
            <nav className="side-nav">
                <ul>
                {sideNavLinks}
                </ul>
            </nav>
        )
    }
}