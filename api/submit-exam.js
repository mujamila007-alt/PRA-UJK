import { adminDb, FieldValue, requireParticipant, json, errorResponse } from '../lib/firebaseAdmin.js';

export async function POST(request){
  try{
    const {decoded}=await requireParticipant(request);const uid=decoded.uid,b=await request.json(),answers=(b.answers&&typeof b.answers==='object')?b.answers:{},attemptRef=adminDb.doc(`attempts/${uid}`),attemptSnap=await attemptRef.get();
    if(!attemptSnap.exists)return json({error:'Percobaan ujian tidak ditemukan.'},404);const attempt=attemptSnap.data();if(attempt.status==='selesai')return json({score:attempt.score,correctCount:attempt.correctCount,wrongCount:attempt.wrongCount,totalQuestions:attempt.totalQuestions,alreadySubmitted:true});
    const qSnap=await adminDb.collection('questions').orderBy('order').get();if(qSnap.empty)return json({error:'Soal ujian tidak tersedia.'},409);
    const keys=await Promise.all(qSnap.docs.map(q=>adminDb.doc(`answerKeys/${q.id}`).get()));let correctCount=0;const detail=[];
    qSnap.docs.forEach((q,i)=>{const qd=q.data(),key=(keys[i].data()?.correct||'').toUpperCase(),selected=['A','B','C','D','E'].includes(String(answers[q.id]||'').toUpperCase())?String(answers[q.id]).toUpperCase():null,isCorrect=!!selected&&selected===key;if(isCorrect)correctCount++;detail.push({id:q.id,order:Number(qd.order)||i+1,question:qd.question||'',selected,correct:key,isCorrect});});
    const total=qSnap.size,wrongCount=total-correctCount,score=total?Math.round(correctCount/total*100):0,batch=adminDb.batch();for(const d of detail)batch.set(adminDb.doc(`attempts/${uid}/answers/${d.id}`),{...d,submittedAt:FieldValue.serverTimestamp()});
    const now=Date.now(),finishReason=now>Number(attempt.deadlineMs||now)?'timeout':(String(b.reason||'manual')==='timeout'?'timeout':'manual');batch.update(attemptRef,{status:'selesai',correctCount,wrongCount,totalQuestions:total,score,finishedAt:FieldValue.serverTimestamp(),finishedAtMs:now,finishReason});await batch.commit();return json({score,correctCount,wrongCount,totalQuestions:total});
  }catch(e){return errorResponse(e);}
}
