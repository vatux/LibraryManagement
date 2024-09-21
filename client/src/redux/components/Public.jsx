import React from 'react'
import { Link } from "react-router-dom";

const Public = () => {
    return(
        <div class="container">
          <div class="page-inner">
            <div class="row">
              <div class="col-md-15">
                <div class="card card-info card-annoucement card-round">
                  <div class="card-body text-center">
                    <div class="card-opening">Hello!</div>
                    <div class="card-desc">
                      Welcome to Library Management!
                    </div>
                    <div class="card-detail">
                      <div class="btn btn-light btn-rounded"><a href='/login'>Login</a></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}

export default Public