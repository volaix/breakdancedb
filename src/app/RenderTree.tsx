import styles from './RenderTree.module.scss'

export default function RenderTree() {
  return (
    <div className={`mt-5 text-2xs   ${styles.tree}`}>
      <ul>
        <li className="">
          <a>List all Moves</a>
          <ul>
            <li>
              <a className="">Training</a>
              <ul>
                <li>
                  <a>Grind Move (in dev)</a>
                  <ul>
                    <li>
                      <a>Transitions</a>
                      <ul>
                        <li>
                          <a>Make Set</a>
                          <ul>
                            <li>
                              <a>Grind Set (in dev)</a>
                              <ul>
                                <li>
                                  <a>Battle</a>
                                </li>
                              </ul>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <a>Creating</a>
              <ul>
                <li>
                  <a>Learn Move</a>
                  <ul>
                    <li>
                      <a>Create Move</a>
                      <ul>
                        <li>
                          <a>RNG Set</a>
                          <ul>
                            <li>
                              <a>Record Fragments</a>
                              <ul>
                                <li>
                                  <a>Signatures</a>
                                </li>
                              </ul>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  )
}
