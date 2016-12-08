import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { signin, signed } from '../actions'


class Signin extends Component {

    onLoadCallback() {
        console.log('gapi load callback')

    }

    componentWillMount() {

    }

    onLoadedGapi() {
        if (!window.gapi) 
            return
            
        window.gapi.signin2.render('my-signin2', {
            'scope': 'profile email',
            'width': 250,
            'height': 50,
            'longtitle': true,
            'theme': 'light',   // 'dark'
            'onsuccess': this.onGoogleSuccess.bind(this),
            'onfailure': this.onGoogleFailure.bind(this)
        })        
    }

    componentDidMount() {
        const googleScriptElt = document.createElement('script')

        googleScriptElt.id = 'google-login'
        googleScriptElt.src = 'https://apis.google.com/js/platform.js'
        googleScriptElt.onload = this.onLoadedGapi.bind(this)

        document.body.appendChild(googleScriptElt)

        window.fbAsyncInit = function() {
            window.FB.init({
                appId      : '{617494655102277}',
                cookie     : true,  // enable cookies to allow the server to access the session
                xfbml      : true,  // parse social plugins on this page
                version    : 'v2.8' // use graph api version 2.8
            })

            // check FB login status on start
            window.FB.getLoginStatus((response) => {
                this.statusChangeCallback(response)
            })

            // listen to FB authentication status change
            // window.FB.Event.subscribe('auth.logout', this.statusChangeCallback.bind(this));
            window.FB.Event.subscribe('auth.statusChange', this.statusChangeCallback.bind(this));            
        }.bind(this)        
    }
    
    onGoogleSuccess(googleUser) {
        const profile = googleUser.getBasicProfile()

        this.props.dispatch(signed({
            signed: true,
            auth: 'google',
            info: {
                id: profile.getId(),            // Do not send to your backend! Use an ID token instead.
                name: profile.getName(),
                image: profile.getImageUrl(),
                email: profile.getEmail()
            }
        }))
    }

    onGoogleFailure(response) {
        console.error('Error authenticating with Google: ' + response)
    }   

    _checkLoginState() {
        window.FB.getLoginStatus((response) => {
            this.statusChangeCallback(response)
        })
    }

    statusChangeCallback(response) {
        // console.log('statusChangeCallback');
        console.log('Facebook response: ' + response);
        // The response object is returned with a status field that lets the
        // app know the current login status of the person.
        // Full docs on the response object can be found in the documentation
        // for FB.getLoginStatus().
        if (response.status === 'connected') {
            window.FB.api('/Me', function(response) {
                // Logged into your app and Facebook
                this.props.dispatch(signed({
                    signed: true,
                    auth: 'facebook',
                    info: {
                        id: response.id, 
                        name: response.name
                        // image: 
                        // email: 
                    }
                }))
            }.bind(this))

        } else if (response.status === 'not_authorized') {
             // The person is logged into Facebook, but not your app
            //  this.props.dispatch(signed(false))

        } else {
            // The person is not logged into Facebook, so we're not sure if
            // they are logged into this app or not.
            //  this.props.dispatch(signed(false))
        }
    }    

    _onCloseSignIn() {
        this.props.dispatch(signin(false))
    }  

    render() {
        const signinStyle = {
            'display': this.props.signing ? 'inherit' : 'none',
        }
        
        return(
          <span 
              className="signin-panel-background"
              style={signinStyle}
              >
              <span className="signin-panel">
                  {
                  <div className="signin-panel-close">
                      <i 
                          className="fa fa-window-close-o fa-2x" 
                          aria-hidden="true"
                          onClick={this._onCloseSignIn.bind(this)} 
                          />
                  </div>
                  }
                  <div className="signin-google">
                  {
                      // https://developers.google.com/identity/sign-in/web/
                      // this is the placeholder for the Google login button
                      <div id="my-signin2" />
                  }
                  </div>             
                  <div className="signin-facebook">
                    {
                      <div className="fb-login-button" 
                          data-max-rows="2" 
                          data-size="xlarge" 
                          data-show-faces="false" 
                          data-auto-logout-link="false"/>
                    }
                  </div>
              </span>
          </span>
        )        
    }
}

Signin.propTypes = {
    signing: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => {
    const signing = state.user.isSigning

    return {
        signing,
    }
}

export default connect(mapStateToProps)(Signin)