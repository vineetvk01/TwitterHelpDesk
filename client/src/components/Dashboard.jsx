import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { fetchMentions } from '../services';
import { Tweet, Details, UserInfo } from './twitter';
import { Container, Content, Title } from './styled-components';
import { SERVER_URL } from '../constants';

const Search = styled.input`
  position: absolute;
  padding: 5px;
  margin: 5px 30px;
  border: 1px solid #d3d3d3;
  border-radius: 10px;
  width: 200px;
  transition: width 0.5s;
  &:hover {
    border: 1px solid #333;
  }
  &:focus {
    border: 1px solid #999;
    width: 250px;
    outline: none;
  }
`;

const Text = styled.p`
  margin: 0 auto;
  color: #333;
  font-size: 14px;
`;

const Image = styled.img`
  margin: auto;
`

export const Tweets = ({ twitter_id, image, search }) => {

  const [mentions, setMentions] = useState([]);
  const [result, setResult] = useState([]);
  let [open, setOpen] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const loadMentions = function (cb) {
    fetchMentions().then(({ mentions }) => {
      setMentions(mentions);
      setIsLoading(false);
      if (cb) cb(mentions[0]);
    })
  }

  useEffect(() => {
    var es = new EventSource(`${SERVER_URL}/stream`);
    es.onmessage = function (event) {
      if (twitter_id === event.data) {
        setIsLoading(true);
        setTimeout(loadMentions, 2000);
      }
    };
    loadMentions(setOpen);
  }, []);

  useEffect(() => {
    if (search !== '') {
      const queried = mentions.filter((mention) => mention.tweet.user.name.includes(search) || mention.tweet.text.includes(search))
      setResult(queried);
    } else {
      setResult([]);
    }
  }, [search])



  return (
    <>
      <div className="container">
        <Content className="column" style={{ flex: 1 }}>
          {isLoading ? <div style={{ margin: '0 auto', color: 'blue' }}>...Incoming...</div> : ''}
          {result.length === 0 ?
            mentions.map((mention) => {
              if (!open) open = mention;
              return <Tweet active={open._id === mention._id} key={mention._id} tweet={mention.tweet} onClick={(e) => { setOpen(mention) }} />
            }) :
            result.map((mention) => {
              return <Tweet active={open._id === mention._id} key={mention._id} tweet={mention.tweet} onClick={(e) => { setOpen(mention) }} />
            })
          }
          {mentions.length === 0 ? <Text>No Mentions yet</Text> : ''}
        </Content>
        {mentions.length !== 0 ?
          (<><Content className="column" style={{ flex: 2, position: 'relative' }}>
            <Details open={open} userImage={image} />
          </Content>
            <Content className="column" style={{ flex: 1 }}>
              <UserInfo open={open} />
            </Content></>) :
          (<Content className="column" style={{ flex: 3 }}>
            <Image src={process.env.PUBLIC_URL + '/img/audience.png'} height='300' width='450' />
          </Content>)
        }
      </div>
    </>)
}


const _TweetsBox = ({ auth }) => {

  const [search, setSearch] = useState('')

  const handle = auth.user.twitterUserOauth.screen_name;
  const image = auth.user.twitterUserOauth.profile_image_url;
  const twitter_id = auth.user.twitterUserOauth.user_id;

  return (
    <div id="right" className="column" style={{ width: '100%' }}>
      <div className="bottom">
        <Container>
          <div className="mini-header">
            <Title>Conversations</Title>
            <Search placeholder="Quick search" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Title style={{ float: 'right', fontSize: 14 }}>Twitter Handle: @{handle}</Title>
          </div>
          <Tweets twitter_id={twitter_id} image={image} search={search} />
        </Container>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  }
}

export const TweetsBox = connect(mapStateToProps, () => { })(_TweetsBox);