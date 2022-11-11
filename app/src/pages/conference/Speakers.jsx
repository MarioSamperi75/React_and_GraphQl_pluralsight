import * as React from "react";
import "./style-sessions.css";
import {gql, useQuery, useMutation} from "@apollo/client";
import { useParams } from "react-router-dom";

/* ---> Define queries, mutations and fragments here */

const SPEAKER_ATTRIBUTES = gql`
  fragment SpeakerInfo on Speaker {
      id
      name
      bio
      sessions {
        id
        title
      }
      featured
  }
`;


const FEATURED_SPEAKER = gql`
  mutation markFeatured($speakerId: ID!, $featured: Boolean!){
    markFeatured(speakerId: $speakerId, featured: $featured) {
      id
      featured
    }
  }
`;

const SPEAKERS = gql`
  query speakers {
    speakers {
      ...SpeakerInfo
    }
  }
  ${SPEAKER_ATTRIBUTES}

`;

const SPEAKERS_BY_ID = gql`
  query speakerById ($id: ID!) {
    speakerById (id: $id) {
      ...SpeakerInfo
    }
  }
  ${SPEAKER_ATTRIBUTES}
`;




const SpeakerList = () => {

  /* ---> Replace hardcoded speaker values with data that you get back from GraphQL server here */
  const [ markFeatured ] = useMutation(FEATURED_SPEAKER);

  const {loading, error, data} = useQuery(SPEAKERS);

  if (loading) {return <p>Is Loading...</p>}
  if (error) {return <p> En error occurred</p>}


  return data.speakers.map((speaker) =>  (
		<div
      key={speaker.id}
      className="col-xs-12 col-sm-6 col-md-6"
      style={{ padding: 5 }}
    >
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">{'Speaker: ' + speaker.name }</h3>
        </div>
        <div className="panel-body">
          <h5>{'Bio: ' + speaker.bio }</h5>
        </div>
        <div className="panel-footer">
          <h4>Sessions</h4>
					{
						speaker.sessions.map((session)=>(
              <span key={session.id} style={{padding: 2}}>
                <p>{session.title}</p>
              </span>
            )
            )
					}
          <span>	
            <button	
              type="button"	
              className="btn btn-default btn-lg"	
              onClick={
                /* ---> Call useMutation's mutate function to mark speaker as featured */
                async() => {
                  await markFeatured({variables: {speakerId: speaker.id, featured: true}})
                
              }}	
              >	
                <i	
                  className={`fa ${speaker.featured ? "fa-star" : "fa-star-o"}`}	
                  aria-hidden="true"	
                  style={{	
                    color: speaker.featured ? "gold" : undefined,	
                  }}	
                ></i>{" "}	
                Featured Speaker	
            </button>	
          </span>
        </div>
      </div>
    </div>
  )

	);
};

const SpeakerDetails = () => {
  const {speaker_id} = useParams();

  const  {loading, error, data } = useQuery(SPEAKERS_BY_ID, {
    variables:  { id: speaker_id },
  });

  if (loading) {return <p>Is Loading...</p>}
  if (error) {return <p> En error occurred</p>}

  const speaker = data.speakerById;
  const {id, name, bio, sessions} = speaker;

    /* ---> Replace hardcoded speaker values with data that you get back from GraphQL server here */
  return (
    <div key={id} className="col-xs-12" style={{ padding: 5 }}>
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">{name}</h3>
        </div>
        <div className="panel-body">
          <h5>{bio}</h5>
        </div>
        <div className="panel-footer">
          {
					
						sessions.map((session)=>(
              <span key={session.id} style={{padding: 2}}>
                <p>{session.title}</p>
              </span>
            )
            )
					
					}
        </div>
      </div>
    </div>
  );
};

export function Speaker() {
  return (
    <>
      <div className="container">
        <div className="row">
          <SpeakerDetails />
        </div>
      </div>
    </>
  );
}


export function Speakers() {
  return (
    <>
      <div className="container">
        <div className="row">
          <SpeakerList />
        </div>
      </div>
    </>
  );
}

	
